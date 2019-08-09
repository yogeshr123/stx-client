import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListboxModule } from 'primeng/listbox';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { DialogModule } from 'primeng/dialog';

import { ColumnMetadataRouting } from './column-metadata.routing';
import { ColumnMetadataComponent } from './column-metadata.component';
import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { AddEditColumnComponent } from './add-edit-column/add-edit-column.component';
import { AllVersionsComponent } from './all-versions/all-versions.component';
import { DimLookupComponent } from './dim-lookup/dim-lookup.component';
import { AddComponent } from './dim-lookup/add/add.component';
import { FactColumnComponent } from './fact-column/fact-column.component';

@NgModule({
  declarations: [
    ColumnMetadataComponent,
    MetadataMappingComponent,
    AddEditColumnComponent,
    AllVersionsComponent,
    DimLookupComponent,
    AddComponent,
    FactColumnComponent],
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ColumnMetadataRouting,
    TableModule,
    NgxLoadingModule.forRoot({}),
    DynamicDialogModule,
    ScrollPanelModule,
    AccordionModule,
    DropdownModule,
    TabViewModule,
    MultiSelectModule,
    ToastModule,
    ConfirmDialogModule,
    ListboxModule,
    AngularDualListBoxModule
  ],
  providers: [MessageService],
  entryComponents: [MetadataMappingComponent, AddComponent, FactColumnComponent]
})
export class ColumnMetadataModule { }
