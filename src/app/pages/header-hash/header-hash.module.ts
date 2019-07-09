import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

import { HeaderHashComponent } from './header-hash.component';
import { HeaderHashRouting } from './header-hash.routing';

@NgModule({
  declarations: [HeaderHashComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderHashRouting,
    NgxLoadingModule.forRoot({}),
    MultiSelectModule,
    ToastModule,
    TableModule,
    DropdownModule
  ],
  providers: [
    MessageService
  ]
})
export class HeaderHashModule { }
