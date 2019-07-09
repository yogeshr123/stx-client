import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HeaderHashComponent } from './header-hash.component';


const routes: Routes = [
    {
        path: '',
        component: HeaderHashComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeaderHashRouting { }
