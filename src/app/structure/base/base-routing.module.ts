// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base.component';
// import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
// import { AuthGuard } from '../../../core/auth';
// import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: '../../pages/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'loadcontrol',
                loadChildren: '../../pages/load-control/load-control.module#LoadControlModule'
            },
            {
                path: 'user-management',
                loadChildren: '../../pages/user-management/user-management.module#UserManagementModule'
            },
            {
                path: 'load-status',
                loadChildren: '../../pages/load-status/load-status.module#LoadStatusModule'
            },
            {
                path: 'CMV',
                loadChildren: '../../pages/column-metadata/column-metadata.module#ColumnMetadataModule'
            },
            {
                path: 'header-hash',
                loadChildren: '../../pages/header-hash/header-hash.module#HeaderHashModule'
            },

            // {
            // 	path: 'error/403',
            // 	component: ErrorPageComponent,
            // 	data: {
            // 		'type': 'error-v6',
            // 		'code': 403,
            // 		'title': '403... Access forbidden',
            // 		'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
            // 	}
            // },
            // { path: 'error/:type', component: ErrorPageComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BaseRoutingModule {
}
