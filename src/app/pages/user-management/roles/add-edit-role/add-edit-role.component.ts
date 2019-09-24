import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RolesService } from 'src/app/services/roles.service';
import { Permission } from 'src/app/model/permissions.table';
import * as _lodash from 'lodash';
import { each, find, some } from 'lodash';
import { Role } from 'src/app/model/roles.table';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent implements OnInit {
  addEditForm: FormGroup;
  selectedRole: any;
  permissions: any;
  roles: any;
  rolePermissions: Permission[] = [];
  routeInfo = {
    path: '',
    isViewOnly: false,
    isEditMode: false,
    isReadMode: false
  };
  loader = {
    formData: false,
    saveEndpoint: false
  };
  appState: any;

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private permissionsService: PermissionsService,
    private confirmationService: ConfirmationService
  ) {
    this.route.url.subscribe(params => {
      this.routeInfo.path = params[1].path;
      if (this.routeInfo.path.indexOf('viewrole') > -1) {
        this.routeInfo.isViewOnly = true;
      }
      if (this.routeInfo.path.indexOf('editrole') > -1) {
        this.routeInfo.isEditMode = true;
      }
      if (this.routeInfo.path.indexOf('read') > -1) {
        this.routeInfo.isReadMode = true;
      }
    });
  }

  ngOnInit() {

    this.appState = this.commonService.getState();

    if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
      this.selectedRole = this.appState.selectedRole;
      this.selectedRole.PERMISSIONSARRAY = this.selectedRole.PERMISSIONS.split(',').map(Number);
    }
    else {
      this.selectedRole = {};
    }
    this.fetchAllPermissions();
  }

  ngOnDestroy() {
    delete this.appState.selectedRole;
    this.commonService.setState(this.appState);
  }

  fetchAllPermissions() {
    this.permissionsService.getPermissions().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.permissions = data.data;
        this.loadCurrentRolesPermissions();
      }
      else {
        this.permissions = [];
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  loadCurrentRolesPermissions() {
    const mainPermissions = this.permissions.filter(el => !el.PARENT);
    mainPermissions.forEach((element: Permission) => {
      let hasUserPermission = false;
      if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
        hasUserPermission = this.selectedRole.PERMISSIONSARRAY.some(t => t === element.ID);
      }
      const rootPermission = new Permission();
      rootPermission.clear();
      rootPermission.isSelected = hasUserPermission;
      rootPermission.children = [];
      rootPermission.ID = element.ID;
      rootPermission.level = element.level;
      rootPermission.PARENT = element.PARENT;
      rootPermission.TITLE = element.TITLE;
      rootPermission.NAME = element.NAME;
      const children = this.permissions.filter(el => el.PARENT && el.PARENT === element.ID);
      children.forEach(child => {
        let hasUserChildPermission = false;
        if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
          hasUserChildPermission = this.selectedRole.PERMISSIONSARRAY.some(t => t === child.ID);
        }
        const childPermission = new Permission();
        childPermission.clear();
        childPermission.isSelected = hasUserChildPermission;
        childPermission.children = [];
        childPermission.ID = child.ID;
        childPermission.level = child.level;
        childPermission.PARENT = child.PARENT;
        childPermission.TITLE = child.TITLE;
        childPermission.NAME = child.NAME;
        rootPermission.children.push(childPermission);
      });
      this.rolePermissions.push(rootPermission);
    });
  }

  isSelectedChanged($event, permission: Permission) {
    if (permission.children.length === 0 && permission.isSelected) {
      const _root = find(this.rolePermissions, (item: Permission) => item.ID === permission.PARENT);
      if (_root && !_root.isSelected) {
        _root.isSelected = true;
      }
      return;
    }

    if (permission.children.length === 0 && !permission.isSelected) {
      const _root = find(this.rolePermissions, (item: Permission) => item.ID === permission.PARENT);
      if (_root && _root.isSelected) {
        if (!some(_root.children, (item: Permission) => item.isSelected === true)) {
          _root.isSelected = false;
        }
      }
      return;
    }

    if (permission.children.length > 0 && permission.isSelected) {
      each(permission.children, (item: Permission) => item.isSelected = true);
      return;
    }

    if (permission.children.length > 0 && !permission.isSelected) {
      each(permission.children, (item: Permission) => {
        item.isSelected = false;
      });
      return;
    }
  }

  preparePermissionIDs(): number[] {
    const result = [];
    each(this.rolePermissions, (root: Permission) => {
      if (root.isSelected) {
        result.push(root.ID);
        each(root.children, (child: Permission) => {
          if (child.isSelected) {
            result.push(child.ID);
          }
        });
      }
    });
    return result;
  }

  prepareRole(): Role {
    const role = new Role();
    role.ID = this.selectedRole.ID;
    role.PERMISSIONSARRAY = this.preparePermissionIDs();
    role.TITLE = this.selectedRole.TITLE;
    role.ISCOREROLE = this.selectedRole.ISCOREROLE;
    return role;
  }

  submit() {
    const editedRole = this.prepareRole();
    editedRole.PERMISSIONS = editedRole.PERMISSIONSARRAY.join(',');
    editedRole.UPDATE_DATE = `${new Date()}`;
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      editedRole.UPDATED_BY = this.appState.loggedInUser.USER_NAME;
    }

    delete editedRole.PERMISSIONSARRAY;
    const body = {
      role: editedRole
    };
    if (editedRole.ID > 0) {
      this.rolesService.updateRole(body).subscribe((data: any) => {
        this.showToast('success', 'role updated.');
        if (editedRole.ID === this.appState.loggedInUser.ROLE) {
          this.confirmationService.confirm({
            rejectVisible: false,
            acceptLabel: 'Ok',
            message: 'You have changed the permissions of logged in user. Please login again...',
            accept: () => {
              // this.router.navigateByUrl('/superlogin');
              window.location.href = environment.ssoLoginURL;
              return false;
            }
          });
        }
        else {
          this.router.navigate(['/user-management/roles']);

        }
      }, error => {
        this.showToast('error', 'Could not update role.');
      });
    } else {
      this.rolesService.addRole(body).subscribe((data: any) => {
        this.showToast('success', 'role saved.');
        this.router.navigate(['/user-management/roles']);
      }, error => {
        this.showToast('error', 'Could not save role.');
      });
    }
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}
