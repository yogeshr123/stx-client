import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { DbEndpointsComponent } from './db-endpoints.component';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';


const routes: Routes = [
    {
        path: '',
        component: DbEndpointsComponent
    },
    {
        path: 'edit',
        component: AddEditDbendpointComponent,
    },
    {
        path: 'add',
        component: AddEditDbendpointComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DbEndpointsRouting { }