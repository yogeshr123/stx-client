import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoadStatusComponent } from './load-status.component';


const routes: Routes = [
    {
        path: '',
        component: LoadStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoadStatusRouting { }
