import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HeaderHashComponent } from './header-hash.component';
import { AddEditHeaderComponent } from './add-edit-header/add-edit-header.component';
import { AuthGuard } from 'src/app/services/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: HeaderHashComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessHeaderHashModule' }
    },
    {
        path: 'add-header',
        component: AddEditHeaderComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addHeaderHashModule' }
    },
    {
        path: 'edit-header/:headerId',
        component: AddEditHeaderComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editHeaderHashModule' }
    },
    {
        path: 'view-header/:headerId',
        component: AddEditHeaderComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readHeaderHashModule' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeaderHashRouting { }
