// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PermissionsComponent } from './permissions/permissions.component';
import { UserManagementRouting } from './user-management.routing';
import { AddEditPermissionComponent } from './permissions/add-edit-permission/add-edit-permission.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { UsersService } from 'src/app/services/users.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { RolesService } from 'src/app/services/roles.service';
import { TableModule } from 'primeng/table';
import { AddEditRoleComponent } from './roles/add-edit-role/add-edit-role.component';
import { AddEditUserComponent } from './users/add-edit-user/add-edit-user.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PermissionModule } from 'src/app/directives/permission/permission.module';
import { CommonService } from 'src/app/services/common.service';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
        CommonModule,
        UserManagementRouting,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        CheckboxModule,
        ToastModule,
        DynamicDialogModule,
        TableModule,
        ConfirmDialogModule,
        PermissionModule,
        NgxLoadingModule.forRoot({})
    ],
    providers: [
        MessageService,
        UsersService,
        PermissionsService,
        RolesService,
        ConfirmationService,
        CommonService
    ],
    declarations: [
        UserManagementComponent,
        UsersComponent,
        RolesComponent,
        PermissionsComponent,
        AddEditPermissionComponent,
        AddEditRoleComponent,
        AddEditUserComponent,
    ],
    entryComponents: [AddEditPermissionComponent, AddEditUserComponent]
})
export class UserManagementModule {
}
