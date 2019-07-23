// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import { LoadControlComponent } from './load-control.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';

import { RecordService } from '../../services/record.service';
import { MessageService } from 'primeng/api';
import { AddLoadControlComponent } from './add-load-control/add-load-control.component';
import { EditLoadControlComponent } from './edit-load-control/edit-load-control.component';
import { LoadControlRouting } from './load-control.routing';
import { DBEndpointsService } from '../../services/db-endpoints.service';

@NgModule({
    imports: [
        CommonModule,
        LoadControlRouting,
        TableModule,
        DropdownModule,
        MultiSelectModule,
        CalendarModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        AccordionModule,
        FormsModule,
        DialogModule,
        FieldsetModule,
        TabViewModule,
        CheckboxModule,
        ReactiveFormsModule,
    ],
    providers: [
        RecordService,
        MessageService,
        ConfirmationService,
        DBEndpointsService
    ],
    declarations: [
        LoadControlComponent,
        AddLoadControlComponent,
        EditLoadControlComponent
    ]
})
export class LoadControlModule {
}
