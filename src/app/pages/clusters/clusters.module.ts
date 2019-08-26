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
                component: ClustersComponent
            },
            {
                path: 'add-cluster',
                component: AddEditClusterComponent
            },
            {
                path: 'edit-cluster',
                component: AddEditClusterComponent
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
