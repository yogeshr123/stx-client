import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  addForm: FormGroup;
  selectedTable: any;
  dimensionTables: any;
  dimensionTableColumns: any;
  tableColumns: any;
  dimensionColumns: any;
  errors = {
    noValidatedVersion: ''
  };

  constructor(
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private columnMetadataService: ColumnMetadataService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.selectedTable = this.config.data.selectedTable;
    this.dimensionTables = this.config.data.dimensionTables;
    this.dimensionTables = this.dimensionTables.map(i => {
      i.schemaTableName = `${i.SCHEMA_NAME}-${i.TABLE_NAME}`;
      return i;
    });
    this.tableColumns = this.config.data.allColumns;
    this.formInit();
  }

  formInit() {
    this.addForm = this.formBuilder.group({
      SCHEMA_NAME: [this.selectedTable.SCHEMA_NAME, Validators.required],
      TABLE_NAME: [this.selectedTable.TABLE_NAME, Validators.required],
      METADATA_VERSION: [this.selectedTable.METADATA_VERSION, Validators.required],
      LOOKUP_TABLE_NAME: ['', Validators.required],
      LOOKUP_TABLE_ALIAS: ['', Validators.required],
      LOOKUP_JOIN_KEYS1: ['', Validators.required],
      LOOKUP_JOIN_KEYS2: ['', Validators.required],
      LOOKUP_COLUMNS: [[], Validators.required],
      UPDATED_BY: ['User'],
      UPDATE_DATE: [new Date()],
    });
  }

  tableSelected(event) {
    this.errors.noValidatedVersion = null;
    this.dimensionTableColumns = [];
    this.getTableVersions(event.value.TABLE_NAME);
    this.addForm.controls.LOOKUP_JOIN_KEYS2.patchValue('');
    this.addForm.controls.LOOKUP_COLUMNS.patchValue([]);
  }

  getTableVersions(tableName) {
    const request = {
      table_name: tableName
    };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      // console.log("resp ", resp);
      if (resp.data && resp.data.length) {
        let validatedVersions = resp.data.map(i => {
          if (i.STATUS === 'VALIDATED') {
            return i.METADATA_VERSION;
          }
        });
        validatedVersions = validatedVersions.filter(i => i !== undefined);
        if (validatedVersions && validatedVersions.length) {
          const max = Math.max.apply(null, validatedVersions);
          this.getDimensionColumns(tableName, max);
        } else {
          this.errors.noValidatedVersion = 'No validated version found for this table.';
        }
      }
    });
  }

  getDimensionColumns(tableName, version) {
    const request = {
      table_name: tableName,
      columnVersion: version
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      this.dimensionTableColumns = resp.data;
    }, error => {
      // this.showToast('error', 'Could not get dimension tables.');
    });
  }

  submit() {
    const lookUpObject = Object.assign(this.addForm.value, {});
    lookUpObject.LOOKUP_SCHEMA_NAME = lookUpObject.LOOKUP_TABLE_NAME.SCHEMA_NAME;
    lookUpObject.LOOKUP_TABLE_NAME = lookUpObject.LOOKUP_TABLE_NAME.TABLE_NAME;
    lookUpObject.UPDATE_DATE = `${lookUpObject.UPDATE_DATE}`;
    lookUpObject.LOOKUP_JOIN_KEYS =
      // tslint:disable-next-line:max-line-length
      `fact.${lookUpObject.LOOKUP_JOIN_KEYS1.TARGET_COLUMN_NAME}=${lookUpObject.LOOKUP_TABLE_ALIAS}.${lookUpObject.LOOKUP_JOIN_KEYS2.TARGET_COLUMN_NAME}`;
    delete lookUpObject.LOOKUP_COLUMNS;
    delete lookUpObject.LOOKUP_JOIN_KEYS1;
    delete lookUpObject.LOOKUP_JOIN_KEYS2;
    this.columnMetadataService.addLookUp({ data: lookUpObject }).subscribe((resp: any) => {
      if (!resp.error) {
        this.showToast('success', 'Successfully saved lookup!');
        this.closePopUp(true);
      } else {
        this.showToast('error', 'Could not save lookup info.');
      }
    }, error => {
      this.showToast('error', 'Could not save lookup info.');
    });
  }

  reset() {
    this.formInit();
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  closePopUp(status) {
    this.ref.close(status);
  }

}
