import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SparkConfigComponent } from './spark-config.component';
import { SparkConfigService } from 'src/app/services/spark-config.service';
import { TableModule } from 'primeng/table';
import { AddEditSparkconfigComponent } from './add-edit-sparkconfig/add-edit-sparkconfig.component';
import { LoadControlService } from 'src/app/services/load-control.service';
import { SparkConfigPropertiesService } from 'src/app/services/spark-config-properties.service';
import { CommonService } from 'src/app/services/common.service';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';

@NgModule({
  declarations: [
    SparkConfigComponent,
    AddEditSparkconfigComponent
  ],
  imports: [
    DateConvertModule,
    CommonModule,
    ToastModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forChild([
      {
        path: '',
        component: SparkConfigComponent
      },
      {
        path: 'edit',
        component: AddEditSparkconfigComponent,
      },
      {
        path: 'add',
        component: AddEditSparkconfigComponent,
      },
      {
        path: 'view',
        component: AddEditSparkconfigComponent,
      }
    ]),
  ],
  providers: [
    MessageService,
    SparkConfigService,
    LoadControlService,
    SparkConfigPropertiesService,
    CommonService
  ],
})
export class SparkConfigModule { }
