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
import { PermissionModule } from 'src/app/directives/permission/permission.module';

@NgModule({
    declarations: [
        BaseComponent,
        HeaderComponent,
        SidebarComponent,
        UnauthorizedComponent,
    ],
    exports: [HeaderComponent, SidebarComponent],
    providers: [],
    imports: [
        CommonModule,
        RouterModule,
        BaseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        PermissionModule,
        // BrowserAnimationsModule,
    ],
})
export class BaseModule {}
