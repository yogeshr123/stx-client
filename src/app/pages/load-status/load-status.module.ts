import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';

import { LoadStatusComponent } from './load-status.component';
import { LoadStatusRouting } from './load-status.routing';

@NgModule({
  declarations: [LoadStatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadStatusRouting,
    ProgressBarModule,
    ToastModule,
    NgxLoadingModule.forRoot({}),
    AutoCompleteModule,
    CalendarModule
  ],
  providers: [MessageService]
})
export class LoadStatusModule { }
