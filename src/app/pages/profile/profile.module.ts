import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { MessageService, ConfirmationService } from 'primeng/api';
// import { UsersService } from 'src/app/services/users.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RolesService } from 'src/app/services/roles.service';

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgxLoadingModule.forRoot({}),
        RouterModule.forChild([
            {
                path: '',
                component: ProfileComponent
            }
        ]),
        DropdownModule,
        TabViewModule,
        ToastModule,
        FileUploadModule,
        ConfirmDialogModule
    ],
    providers: [
        MessageService,
        // UsersService,
        ConfirmationService,
        RolesService
    ],
})
export class ProfileModule { }
