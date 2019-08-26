// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { DbEndpointsComponent } from './db-endpoints.component';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { DbEndpointsRouting } from './db-endpoints.routing';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/common.service';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';

@NgModule({
    imports: [
        DateConvertModule,
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
        DialogService,
        CommonService
    ],
    declarations: [
        DbEndpointsComponent,
        AddEditDbendpointComponent,
    ],
    // entryComponents: [AddEditDbendpointComponent]
})
export class DbEndpointsModule {
}
