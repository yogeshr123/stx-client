import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ClustersComponent } from './clusters.component';
import { RouterModule } from '@angular/router';
import { AddEditClusterComponent } from './add-edit-cluster/add-edit-cluster.component';
import { PermissionModule } from 'src/app/directives/permission/permission.module';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';
import { AuthGuard } from 'src/app/services/auth.guard';

@NgModule({
    declarations: [
        ClustersComponent,
        AddEditClusterComponent
    ],
    imports: [
        DateConvertModule,
        PermissionModule,
        TooltipModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TableModule,
        NgxLoadingModule.forRoot({}),
        RouterModule.forChild([
            {
                path: '',
                component: ClustersComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessClustersModule' }
            },
            {
                path: 'add-cluster',
                component: AddEditClusterComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'addClustersModule' }
            },
            {
                path: 'edit-cluster',
                component: AddEditClusterComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'editClustersModule' }
            },
            {
                path: 'view-cluster',
                component: AddEditClusterComponent,
                canActivate: [AuthGuard],
                data: { expectedPermission: 'readClustersModule' }
            }
        ]),
        DropdownModule,
        TabViewModule,
        ToastModule,
    ],
    providers: [MessageService],
    entryComponents: []
})
export class ClustersModule { }
