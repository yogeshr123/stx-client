// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
;
import { ToastModule } from 'primeng/toast';


import { MessageService } from 'primeng/api';
import { NgxLoadingModule } from 'ngx-loading';
import { SparkConfigComponent } from './spark-config.component';
import { SparkConfigRouting } from './spark-config.routing';

@NgModule({
  imports: [
    SparkConfigRouting,
    CommonModule,
    ToastModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [
    MessageService,
  ],
  declarations: [
    SparkConfigComponent,
  ]
})
export class SparkConfigModule { }
