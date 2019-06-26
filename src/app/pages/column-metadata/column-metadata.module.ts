import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';

import { ColumnMetadataRouting } from './column-metadata.routing';
import { ColumnMetadataComponent } from './column-metadata.component';

@NgModule({
  declarations: [ColumnMetadataComponent],
  imports: [
    CommonModule,
    ColumnMetadataRouting,
    TableModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class ColumnMetadataModule { }
