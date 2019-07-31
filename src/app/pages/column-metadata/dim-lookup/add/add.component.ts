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
  saveLookUpLoader = false;
  counter = 0;

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
    // Save in lookUp Table
    this.saveLookUpLoader = true;
    const lookUpObject = Object.assign({}, this.addForm.value);
    lookUpObject.LOOKUP_SCHEMA_NAME = lookUpObject.LOOKUP_TABLE_NAME.SCHEMA_NAME;
    lookUpObject.LOOKUP_TABLE_NAME = lookUpObject.LOOKUP_TABLE_NAME.TABLE_NAME;
    lookUpObject.UPDATE_DATE = `${lookUpObject.UPDATE_DATE}`;
    lookUpObject.LOOKUP_JOIN_KEYS =
      // tslint:disable-next-line:max-line-length
      `fact.${lookUpObject.LOOKUP_JOIN_KEYS1.TARGET_COLUMN_NAME}=${lookUpObject.LOOKUP_TABLE_ALIAS}.${lookUpObject.LOOKUP_JOIN_KEYS2.TARGET_COLUMN_NAME}`;
    delete lookUpObject.LOOKUP_JOIN_KEYS1;
    delete lookUpObject.LOOKUP_JOIN_KEYS2;
    delete lookUpObject.LOOKUP_COLUMNS;
    this.columnMetadataService.addLookUp({ data: lookUpObject }).subscribe((resp: any) => {
      if (!resp.error) {
        if (this.counter === columnsToAdd.length + 1) {
          this.showToast('success', 'Successfully saved lookup!');
          this.closePopUp(true);
        }
      } else {
        this.showToast('error', 'Could not save lookup info.');
      }
      this.saveLookUpLoader = false;
    }, error => {
      this.showToast('error', 'Could not save lookup info.');
      this.saveLookUpLoader = false;
    });
    let columnsToAdd = Object.assign({}, this.addForm.value);
    columnsToAdd = columnsToAdd.LOOKUP_COLUMNS.map(i => {
      i.SCHEMA_NAME = this.selectedTable.SCHEMA_NAME;
      i.LOOKUP_TABLE_ALIAS = i.LOOKUP_TABLE_ALIAS;
      i.INTERNAL_COLUMN = i.INTERNAL_COLUMN.data ? i.INTERNAL_COLUMN.data[0] : i.INTERNAL_COLUMN;
      i.IS_DATATYPE_CHANGED =
        i.IS_DATATYPE_CHANGED.data ? i.IS_DATATYPE_CHANGED.data[0] : i.IS_DATATYPE_CHANGED;
      i.IS_NEW = 1;
      i.IS_PARTITION_COLUMN =
        i.IS_PARTITION_COLUMN.data ? i.IS_PARTITION_COLUMN.data[0] : i.IS_PARTITION_COLUMN;
      i.IS_PKEY_COLUMN =
        i.IS_PKEY_COLUMN.data ? i.IS_PKEY_COLUMN.data[0] : i.IS_PKEY_COLUMN;
      i.IS_RENAMED =
        i.IS_RENAMED.data ? i.IS_RENAMED.data[0] : i.IS_RENAMED;
      i.IS_UPDATE_DATE_COLUMN =
        i.IS_UPDATE_DATE_COLUMN.data ? i.IS_UPDATE_DATE_COLUMN.data[0] : i.IS_UPDATE_DATE_COLUMN;
      i.SRC_COLUMN_TYPE = 'DIMLOOKUP';
      i.TABLE_NAME = this.selectedTable.TABLE_NAME;
      i.TARGET_COLUMN_NAME = `${columnsToAdd.LOOKUP_TABLE_ALIAS}_${i.TARGET_COLUMN_NAME}`;
      i.METADATA_VERSION = this.selectedTable.METADATA_VERSION;
      i.UPDATE_DATE = `${new Date()}`;
      return i;
    });
    for (const iterator of columnsToAdd) {
      this.addNewColumns(iterator, columnsToAdd);
    }

  }

  addNewColumns(column, columnsToAdd) {
    return this.columnMetadataService.addColumn({ data: column }).subscribe((resp: any) => {
      this.counter = this.counter + 1;
      if (this.counter === columnsToAdd.length + 1) {
        this.showToast('success', 'Successfully saved lookup!');
        this.closePopUp(true);
      }
    }, error => {
      this.showToast('error', 'Could not save column info.');
      this.saveLookUpLoader = false;
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
