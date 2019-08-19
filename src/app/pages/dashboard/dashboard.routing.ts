import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DataLatencySummaryComponent } from './data-latency-summary/data-latency-summary.component';
import { LoadingStatusSummaryComponent } from './loading-status-summary/loading-status-summary.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard/emr',
        component: DashboardComponent
    },
    {
        path: 'emr',
        component: DashboardComponent
    },
    {
        path: 'data-latency-summary',
        component: DataLatencySummaryComponent
    },
    {
        path: 'loading-status-summary',
        component: LoadingStatusSummaryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRouting { }
