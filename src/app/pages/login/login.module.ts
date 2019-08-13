// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PermissionsService } from 'src/app/services/permissions.service';
import { RolesService } from 'src/app/services/roles.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginComponent
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    providers: [
        AuthService,
        MessageService,
        PermissionsService,
        RolesService
    ],
    declarations: [
        LoginComponent,
    ]
})
export class LoginModule {
}
