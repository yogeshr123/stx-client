import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';
import { PermissionsService } from 'src/app/services/permissions.service';
import { permissionTableColumns } from '../../../model/permissions.table';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  providers: [DialogService]
})
export class PermissionsComponent implements OnInit {
  permissionTableColumns = permissionTableColumns;
  selectedPermission: any;
  permissions: any[];
  constructor(
    private messageService: MessageService,
    public dialogService: DialogService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionsService.getPermissions().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.permissions = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  addNew(isNew) {
    let header;
    if (isNew) {
      this.selectedPermission = {};
      header = 'Add Permission';
    }
    else {
      header = 'Edit Permission';
    }
    const ref = this.dialogService.open(AddEditPermissionComponent, {
      header: header,
      width: '55%',
      data: {
        selectedPermission: this.selectedPermission,
        permissions: this.permissions,
        isNew: isNew
      }
    });

    ref.onClose.subscribe((reason) => {
      if (reason) {
        this.ngOnInit();
      }
    });
  }
  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  selectPermission(permission: any) {
    this.selectedPermission = permission;
    this.addNew(false);
  }

  deletePermission(permission: any) {
    if (permission.ID) {
      this.permissionsService.deletePermission(permission.ID).subscribe((data: any) => {
        this.showToast('success', 'permission deleted.');
        this.ngOnInit();
      }, error => {
        this.showToast('error', 'Could not delete permission.');
      });
    }
  }
}

