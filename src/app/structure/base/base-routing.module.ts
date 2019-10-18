// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { UnauthorizedComponent } from 'src/app/pages/unauthorized/unauthorized.component';
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
                loadChildren: '../../pages/load-control/load-control.module#LoadControlModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessLoadControlModule' }
            },
            {
                path: 'user-management',
                loadChildren: '../../pages/user-management/user-management.module#UserManagementModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessUserManagementModule' }
            },
            {
                path: 'load-status',
                loadChildren: '../../pages/load-status/load-status.module#LoadStatusModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessLoadStatusModule' }
            },
            {
                path: 'CMV',
                loadChildren: '../../pages/column-metadata/column-metadata.module#ColumnMetadataModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessColumnMetadataModule' }
            },
            {
                path: 'header-hash',
                loadChildren: '../../pages/header-hash/header-hash.module#HeaderHashModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessHeaderHashModule' }
            },
            {
                path: 'clusters',
                loadChildren: '../../pages/clusters/clusters.module#ClustersModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessClustersModule' }
            },
            {
                path: 'unauthorized',
                component: UnauthorizedComponent
            },
            {
                path: 'profile',
                // component: ProfileComponent
                loadChildren: '../../pages/profile/profile.module#ProfileModule',
            },
            {
                path: 'db-endpoints',
                loadChildren: '../../pages/db-endpoints/db-endpoints.module#DbEndpointsModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessDBEndponitsModule' }
            },
            {
                path: 'spark-config',
                loadChildren: '../../pages/spark-config/spark-config.module#SparkConfigModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessSparkConfigModule' }
            },
            {
                path: 'email-config',
                loadChildren: '../../pages/email-config/email-config.module#EmailConfigModule',
                canActivate: [AuthGuard],
                data: { expectedPermission: 'accessDBEndponitsModule' }
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
