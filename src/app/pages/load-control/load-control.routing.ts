import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoadControlComponent } from './load-control.component';
import { AddLoadControlComponent } from './add-load-control/add-load-control.component';
import { EditLoadControlComponent } from './edit-load-control/edit-load-control.component';
import { AuthGuard } from 'src/app/services/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: LoadControlComponent
    },
    {
        path: 'edit',
        component: EditLoadControlComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editLoadControlModule' }
    },
    {
        path: 'view',
        component: EditLoadControlComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readLoadControlModule' }
    },
    {
        path: 'add',
        component: AddLoadControlComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addLoadControlModule' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoadControlRouting { }