import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { ColumnMetadataRouting } from './column-metadata.routing';
import { ColumnMetadataComponent } from './column-metadata.component';
import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { AddEditColumnComponent } from './add-edit-column/add-edit-column.component';

@NgModule({
  declarations: [ColumnMetadataComponent, MetadataMappingComponent, AddEditColumnComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ColumnMetadataRouting,
    TableModule,
    NgxLoadingModule.forRoot({}),
    DynamicDialogModule,
    ScrollPanelModule
  ],
  entryComponents: [MetadataMappingComponent]
})
export class ColumnMetadataModule { }
