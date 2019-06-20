// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent
            },
        ]),
    ],
    providers: [],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {
}
