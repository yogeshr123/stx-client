// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// NgBootstrap
import { NgxLoadingModule } from 'ngx-loading';
import { DashboardComponent } from './dashboard.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { DataLatencySummaryComponent } from './data-latency-summary/data-latency-summary.component';
import { LoadingStatusSummaryComponent } from './loading-status-summary/loading-status-summary.component';
import { DashboardRouting } from './dashboard.routing';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        MultiSelectModule,
        DashboardRouting,
        NgxLoadingModule.forRoot({}),
    ],
    providers: [MessageService],
    declarations: [
        DashboardComponent,
        DataLatencySummaryComponent,
        LoadingStatusSummaryComponent,
    ]
})
export class DashboardModule {
}
