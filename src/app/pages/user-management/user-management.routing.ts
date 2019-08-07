import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserManagementComponent } from './user-management.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'roles',
                component: RolesComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'permissions',
                component: PermissionsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRouting { }