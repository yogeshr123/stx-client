// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { RegisterComponent } from './register.component';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PermissionsService } from 'src/app/services/permissions.service';
import { RolesService } from 'src/app/services/roles.service';
import { UsersService } from 'src/app/services/users.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: RegisterComponent,
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    providers: [UsersService, MessageService, PermissionsService, RolesService],
    declarations: [RegisterComponent],
})
export class RegisterModule {}
