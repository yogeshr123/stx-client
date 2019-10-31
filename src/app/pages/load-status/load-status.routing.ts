import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoadStatusComponent } from './load-status.component';
import { AuthGuard } from 'src/app/services/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: LoadStatusComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessLoadStatusModule' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoadStatusRouting { }
