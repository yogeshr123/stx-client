import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DataLatencySummaryComponent } from './data-latency-summary/data-latency-summary.component';
import { LoadingStatusSummaryComponent } from './loading-status-summary/loading-status-summary.component';
import { AuthGuard } from 'src/app/services/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessDashboardModule' }
    },
    {
        path: 'emr',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readDashboardModule' }
    },
    {
        path: 'data-latency-summary',
        component: DataLatencySummaryComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readDashboardModule' }
    },
    {
        path: 'loading-status-summary',
        component: LoadingStatusSummaryComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readDashboardModule' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRouting { }
