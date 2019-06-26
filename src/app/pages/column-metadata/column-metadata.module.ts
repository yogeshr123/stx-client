import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnMetadataRouting } from './column-metadata.routing';

import { ColumnMetadataComponent } from './column-metadata.component';

@NgModule({
  declarations: [ColumnMetadataComponent],
  imports: [
    CommonModule,
    ColumnMetadataRouting
  ]
})
export class ColumnMetadataModule { }
