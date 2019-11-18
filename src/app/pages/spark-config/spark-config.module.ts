import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SparkConfigComponent } from './spark-config.component';
import { TableModule } from 'primeng/table';
import { AddEditSparkconfigComponent } from './add-edit-sparkconfig/add-edit-sparkconfig.component';
import { LoadControlService } from 'src/app/services/load-control.service';
import { CommonService } from 'src/app/services/common.service';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';
import { PermissionModule } from 'src/app/directives/permission/permission.module';
import { AuthGuard } from 'src/app/services/auth.guard';

@NgModule({
    declarations: [SparkConfigComponent, AddEditSparkconfigComponent],
    imports: [
        PermissionModule,
        DateConvertModule,
        CommonModule,
        ToastModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        RouterModule.forChild([
            {
                path: '',
                component: SparkConfigComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessSparkConfigModule' },
            },
            {
                path: 'edit',
                component: AddEditSparkconfigComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'editSparkConfigModule' },
            },
            {
                path: 'add',
                component: AddEditSparkconfigComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'addSparkConfigModule' },
            },
            {
                path: 'view',
                component: AddEditSparkconfigComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'readSparkConfigModule' },
            },
        ]),
    ],
    providers: [MessageService, LoadControlService, CommonService],
})
export class SparkConfigModule {}
