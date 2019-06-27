import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { ColumnMetadataRouting } from './column-metadata.routing';
import { ColumnMetadataComponent } from './column-metadata.component';
import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { AddEditColumnComponent } from './add-edit-column/add-edit-column.component';

@NgModule({
  declarations: [ColumnMetadataComponent, MetadataMappingComponent, AddEditColumnComponent],
  imports: [
    CommonModule,
    ColumnMetadataRouting,
    TableModule,
    NgxLoadingModule.forRoot({}),
    DynamicDialogModule
  ],
  entryComponents: [MetadataMappingComponent]
})
export class ColumnMetadataModule { }
