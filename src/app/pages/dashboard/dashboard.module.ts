// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { NgxLoadingModule } from 'ngx-loading';
import { DashboardComponent } from './dashboard.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { DataLatencySummaryComponent } from './data-latency-summary/data-latency-summary.component';
import { LoadingStatusSummaryComponent } from './loading-status-summary/loading-status-summary.component';
import { DashboardRouting } from './dashboard.routing';
import { DetailsPopupComponent } from './details-popup/details-popup.component';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        MultiSelectModule,
        DashboardRouting,
        NgxLoadingModule.forRoot({}),
        DynamicDialogModule,
        ToastModule,
        DateConvertModule
    ],
    providers: [MessageService],
    declarations: [
        DashboardComponent,
        DataLatencySummaryComponent,
        LoadingStatusSummaryComponent,
        DetailsPopupComponent,
    ],
    entryComponents: [DetailsPopupComponent]
})
export class DashboardModule {
}
