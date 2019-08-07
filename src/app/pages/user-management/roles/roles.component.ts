import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';
import { roleTableColumns } from '../../../model/roles.table';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { RolesService } from 'src/app/services/roles.service';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    providers: [DialogService]
})
export class RolesComponent implements OnInit {
    roleTableColumns = roleTableColumns;
    selectedRole: any;
    permissions: any[];
    roles: any[];
    constructor(
        private messageService: MessageService,
        public dialogService: DialogService,
        private rolesService: RolesService,
        private permissionsService: PermissionsService
    ) { }

    ngOnInit() {
        this.loadRoles();
        this.loadPermissions();
    }

    loadRoles() {
        this.rolesService.getRoles().subscribe((data: any) => {
            if (data.data && data.data.length > 0) {
                this.roles = data.data;
            }
        }, error => {
            this.showToast('error', 'Error while fetching data.');
        });
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
            this.selectedRole = {};
            header = 'Add Role';
        }
        else {
            header = 'Edit Role';
        }
        const ref = this.dialogService.open(AddEditRoleComponent, {
            header: header,
            width: '55%',
            data: {
                selectedRole: this.selectedRole,
                roles: this.roles,
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

    selectRole(role: any) {
        this.selectedRole = role;
        this.addNew(false);
    }

    deleteRole(role: any) {
        if (role.ID) {
            this.rolesService.deleteRole(role.ID).subscribe((data: any) => {
                this.showToast('success', 'Role deleted.');
                this.ngOnInit();
            }, error => {
                this.showToast('error', 'Could not delete role.');
            });
        }
    }
}

