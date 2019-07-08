import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DayPilotModule } from 'daypilot-pro-angular';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
// import { GanttModule, GanttService } from 'ngx-gantt';
import { GanttModule } from 'gantt-ui-component';
import { NgGanttEditorModule } from 'ng-gantt';

import { LoadStatusComponent } from './load-status.component';
import { LoadStatusRouting } from './load-status.routing';

@NgModule({
  declarations: [LoadStatusComponent],
  imports: [
    GanttModule.forRoot(),
    NgGanttEditorModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadStatusRouting,
    DayPilotModule,
    ProgressBarModule,
    ToastModule,
    NgxLoadingModule.forRoot({}),
    AutoCompleteModule,
    CalendarModule
  ],
  providers: [MessageService]
})
export class LoadStatusModule { }
