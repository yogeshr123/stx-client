import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { roleTableColumns } from '../../../model/roles.table';
import { RolesService } from 'src/app/services/roles.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
    roleTableColumns = roleTableColumns;
    selectedRole: any;
    permissions: any[];
    roles: any[];
    appState: any;

    constructor(
        private messageService: MessageService,
        private rolesService: RolesService,
        private permissionsService: PermissionsService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit() {
        this.appState = this.commonService.getState();
        this.loadRoles();
        this.loadPermissions();
    }

    loadRoles() {
        this.rolesService.getRoles().subscribe(
            (data: any) => {
                if (data.data && data.data.length > 0) {
                    this.roles = data.data;
                } else {
                    this.roles = [];
                }
            },
            error => {
                this.showToast('error', 'Error while fetching data.');
            }
        );
    }

    loadPermissions() {
        this.permissionsService.getPermissions().subscribe(
            (data: any) => {
                if (data.data && data.data.length > 0) {
                    this.permissions = data.data;
                } else {
                    this.permissions = [];
                }
            },
            error => {
                this.showToast('error', 'Error while fetching data.');
            }
        );
    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }

    selectRole(role: any, edit: boolean) {
        this.appState = { ...this.appState, selectedRole: role };
        this.commonService.setState(this.appState);
        if (edit) {
            this.router.navigate(['/user-management/roles/editrole']);
        } else {
            this.router.navigate(['/user-management/roles/viewrole']);
        }
    }

    deleteRole(role: any) {
        if (role.ID) {
            this.rolesService.deleteRoleById(role.ID).subscribe(
                (data: any) => {
                    this.showToast('success', 'Role deleted.');
                    this.ngOnInit();
                },
                error => {
                    this.showToast('error', 'Could not delete role.');
                }
            );
        }
    }
}
