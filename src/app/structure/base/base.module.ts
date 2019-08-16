// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BaseComponent } from './base.component';
import { BaseRoutingModule } from './base-routing.module';
import { UnauthorizedComponent } from 'src/app/pages/unauthorized/unauthorized.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { DbEndpointsComponent } from 'src/app/pages/db-endpoints/db-endpoints.component';
import { ClustersComponent } from 'src/app/pages/clusters/clusters.component';

@NgModule({
    declarations: [
        BaseComponent,
        HeaderComponent,
        SidebarComponent,
        UnauthorizedComponent,
        ProfileComponent,
        ClustersComponent,
        DbEndpointsComponent
    ],
    exports: [
        HeaderComponent,
        SidebarComponent
    ],
    providers: [
    ],
    imports: [
        CommonModule,
        RouterModule,
        BaseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        // BrowserAnimationsModule,
    ]
})
export class BaseModule {
}
