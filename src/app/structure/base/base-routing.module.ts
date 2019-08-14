// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { UnauthorizedComponent } from 'src/app/pages/unauthorized/unauthorized.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { DbEndpointsComponent } from 'src/app/pages/db-endpoints/db-endpoints.component';
import { ClustersComponent } from 'src/app/pages/clusters/clusters.component';
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
                // canActivate: [AuthGuard],
                // data: { expectedPermission: 'accessUserManagementModule' }
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
                path: 'unauthorized',
                component: UnauthorizedComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'db-endpoints',
                component: DbEndpointsComponent
            },
            {
                path: 'clusters',
                component: ClustersComponent
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
