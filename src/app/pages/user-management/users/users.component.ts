import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { userTableColumns } from '../../../model/users.table';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { RolesService } from 'src/app/services/roles.service';
import { each, find } from 'lodash';

@Component({
    selector: 'app-user',
    templateUrl: './users.component.html',
    styles: [],
    providers: [DialogService]
})
export class UsersComponent implements OnInit {
    count: number = 1;
    userTableColumns = userTableColumns;
    selectedUser: any;
    users: any[];
    roles: any;
    constructor(
        private messageService: MessageService,
        public dialogService: DialogService,
        private usersService: UsersService,
        private rolesService: RolesService
    ) { }

    ngOnInit() {
        this.loadRoles();
        this.loadUsers();
    }

    loadUsers() {
        this.usersService.getUsers().subscribe((data: any) => {
            if (data.data && data.data.length > 0) {
                this.users = data.data;
            }
        }, error => {
            this.showToast('error', 'Error while fetching data.');
        });
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

    addNew(isNew) {
        let header;
        if (isNew) {
            this.selectedUser = {};
            header = 'Add User';
        }
        else {
            header = 'Edit User';
        }
        const ref = this.dialogService.open(AddEditUserComponent, {
            header: header,
            width: '55%',
            data: {
                selectedUser: this.selectedUser,
                users: this.users,
                roles: this.roles,
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

    selectUser(user: any) {
        this.selectedUser = user;
        this.addNew(false);
    }

    deleteUser(user: any) {
        if (user.ID) {
            this.usersService.deleteUser(user.ID).subscribe((data: any) => {
                this.showToast('success', 'User deleted.');
                this.ngOnInit();
            }, error => {
                this.showToast('error', 'Could not delete user.');
            });
        }
    }

    getUserRolesStr(id: any): string {
        // this.count++;
        let title: string;
        // console.log("test" + this.count);
        const _role = find(this.roles, (role: any) => role.ID === id);
        if (_role) {
            title = _role.TITLE;
        }
        return title;
    }
}