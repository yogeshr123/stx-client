import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { DbEndpointsComponent } from './db-endpoints.component';


const routes: Routes = [
    {
        path: '',
        component: DbEndpointsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DbEndpointsRouting { }