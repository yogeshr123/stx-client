import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { DbEndpointsComponent } from './db-endpoints.component';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';


const routes: Routes = [
    {
        path: '',
        component: DbEndpointsComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessDBEndponitsModule' }
    },
    {
        path: 'edit',
        component: AddEditDbendpointComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editDBEndponitsModule' }
    },
    {
        path: 'add',
        component: AddEditDbendpointComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addDBEndponitsModule' }
    },
    {
        path: 'view',
        component: AddEditDbendpointComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readDBEndponitsModule' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DbEndpointsRouting { }