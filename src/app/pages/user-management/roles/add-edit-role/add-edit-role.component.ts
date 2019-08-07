import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { RolesService } from 'src/app/services/roles.service';
import { Permission } from 'src/app/model/permissions.table';
import * as _lodash from 'lodash';
import { each, find, some } from 'lodash';
import { Role } from 'src/app/model/roles.table';

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
  isNew: boolean = true;
  rolePermissions: Permission[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private rolesService: RolesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.selectedRole = this.config.data.selectedRole;
    this.permissions = this.config.data.permissions;
    this.roles = this.config.data.roles;
    this.isNew = this.config.data.isNew;
    if (!this.isNew) {
      this.selectedRole.PERMISSIONSARRAY = this.selectedRole.PERMISSIONS.split(',').map(Number);
    }
    this.loadPermissions();
  }

  loadPermissions() {
    const mainPermissions = this.permissions.filter(el => !el.PARENT);
    mainPermissions.forEach((element: Permission) => {
      let hasUserPermission = false;
      if (!this.isNew) {
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
        if (!this.isNew) {
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
    delete editedRole.PERMISSIONSARRAY;
    const body = {
      role: editedRole
    };
    if (editedRole.ID > 0) {
      this.rolesService.updateRole(body).subscribe((data: any) => {
        this.showToast('success', 'role updated.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not update role.');
      });
    } else {
      this.rolesService.addRole(body).subscribe((data: any) => {
        this.showToast('success', 'role saved.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not save role.');
      });
    }
  }

  closeModal(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}
