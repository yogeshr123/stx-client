import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SparkConfigService } from 'src/app/services/spark-config.service';
import { TableModule } from 'primeng/table';
import { LoadControlService } from 'src/app/services/load-control.service';
import { SparkConfigPropertiesService } from 'src/app/services/spark-config-properties.service';
import { CommonService } from 'src/app/services/common.service';
import { DateConvertModule } from 'src/app/pipes/date-convert.module';
import { EmailConfigComponent } from './email-config.component';
import { AddEditEmailComponent } from './add-edit-email/add-edit-email.component';

@NgModule({
  declarations: [
    EmailConfigComponent,
    AddEditEmailComponent
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
        component: EmailConfigComponent
      },
      {
        path: 'add',
        component: AddEditEmailComponent
      },
      {
        path: 'view',
        component: AddEditEmailComponent
      },
      {
        path: 'edit',
        component: AddEditEmailComponent
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
export class EmailConfigModule { }
