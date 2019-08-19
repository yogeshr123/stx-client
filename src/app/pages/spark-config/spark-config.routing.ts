import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'src/app/services/auth.guard';
import { SparkConfigComponent } from './spark-config.component';


const routes: Routes = [
    {
        path: '',
        component: SparkConfigComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SparkConfigRouting { }