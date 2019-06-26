import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoadControlComponent } from './load-control.component';
import { AddLoadControlComponent } from './add-load-control/add-load-control.component';
import { EditLoadControlComponent } from './edit-load-control/edit-load-control.component';


const routes: Routes = [
    {
        path: '',
        component: LoadControlComponent
    },
    {
        path: 'edit',
        component: EditLoadControlComponent
    },
    {
        path: 'add',
        component: AddLoadControlComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoadControlRouting { }