import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DayPilotModule } from 'daypilot-pro-angular';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoadStatusComponent } from './load-status.component';
import { LoadStatusRouting } from './load-status.routing';

@NgModule({
  declarations: [LoadStatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadStatusRouting,
    DayPilotModule,
    ProgressBarModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class LoadStatusModule { }
