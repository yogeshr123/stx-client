// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, DialogService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';

import { RecordService } from '../../services/record.service';
import { MessageService } from 'primeng/api';
import { LoadControlService } from 'src/app/services/load-control.service';
import { PermissionModule } from 'src/app/directives/permission/permission.module';
import { NgxLoadingModule } from 'ngx-loading';
import { DbEndpointsComponent } from './db-endpoints.component';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { DbEndpointsRouting } from './db-endpoints.routing';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
    imports: [
        DbEndpointsRouting,
        CommonModule,
        ToastModule,
        TableModule,
        ReactiveFormsModule,
        NgxLoadingModule.forRoot({}),
        DynamicDialogModule
    ],
    providers: [
        DBEndpointsService,
        MessageService,
        DialogService
    ],
    declarations: [
        DbEndpointsComponent,
        AddEditDbendpointComponent,
    ],
    entryComponents: [AddEditDbendpointComponent]
})
export class DbEndpointsModule {
}
