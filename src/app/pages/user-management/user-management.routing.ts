import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserManagementComponent } from './user-management.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddEditRoleComponent } from './roles/add-edit-role/add-edit-role.component';
import { AuthGuard } from 'src/app/services/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessUserManagementModule' },
    },
    {
        path: '',
        redirectTo: 'users',
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessUserManagementModule' },
    },
    {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessUserManagementModule' },
    },
    {
        path: 'roles/editrole',
        component: AddEditRoleComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editUserManagementModule' },
    },
    {
        path: 'roles/addrole',
        component: AddEditRoleComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addUserManagementModule' },
    },
    {
        path: 'roles/viewrole',
        component: AddEditRoleComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readUserManagementModule' },
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessUserManagementModule' },
    },
    {
        path: 'permissions',
        component: PermissionsComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessUserManagementModule' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserManagementRouting {}
