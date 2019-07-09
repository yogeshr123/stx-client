import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HeaderHashComponent } from './header-hash.component';
import { AddEditHeaderComponent } from './add-edit-header/add-edit-header.component';


const routes: Routes = [
    {
        path: '',
        component: HeaderHashComponent
    },
    {
        path: 'add-header',
        component: AddEditHeaderComponent
    },
    {
        path: 'edit-header/:headerId',
        component: AddEditHeaderComponent
    },
    {
        path: 'view-header/:headerId',
        component: AddEditHeaderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeaderHashRouting { }
