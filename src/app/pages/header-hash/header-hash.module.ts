import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { HeaderHashComponent } from './header-hash.component';
import { HeaderHashRouting } from './header-hash.routing';
import { AddEditHeaderComponent } from './add-edit-header/add-edit-header.component';
import { AddCmvPopupComponent } from './add-cmv-popup/add-cmv-popup.component';
import { PermissionModule } from 'src/app/directives/permission/permission.module';

@NgModule({
  declarations: [HeaderHashComponent, AddEditHeaderComponent, AddCmvPopupComponent],
  imports: [
    ToggleButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderHashRouting,
    NgxLoadingModule.forRoot({}),
    MultiSelectModule,
    ToastModule,
    TableModule,
    DropdownModule,
    DynamicDialogModule,
    PermissionModule
  ],
  providers: [
    MessageService
  ],
  entryComponents: [AddCmvPopupComponent]
})
export class HeaderHashModule { }
