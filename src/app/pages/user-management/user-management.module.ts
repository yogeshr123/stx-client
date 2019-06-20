// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './users/user.component';
import { RoleComponent } from './roles/role.component';
import { UserManagementComponent } from './user-management.component';

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
                component: RoleComponent
            },
            {
                path: 'users',
                component: UserComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    declarations: [
        UserManagementComponent,
        UserComponent,
        RoleComponent
    ]
})
export class UserManagementModule {
}
