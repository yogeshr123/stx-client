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
  action: any;
  lookUp: any;
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
    this.action = this.config.data.action;
    this.lookUp = this.config.data.lookUp;
    this.dimensionTables = this.dimensionTables.map(i => {
      i.schemaTableName = `${i.SCHEMA_NAME}-${i.TABLE_NAME}`;
      return i;
    });
    this.tableColumns = this.config.data.allColumns;
    this.formInit();
    if (this.action === 'view' || this.action === 'edit') {
      this.setValuesInViewEdit();
    }
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
      PREFIX: ['', Validators.required],
      UPDATED_BY: ['User'],
      UPDATE_DATE: [new Date()],
    });
  }

  setValuesInViewEdit() {
    this.addForm.controls.SCHEMA_NAME.patchValue(this.lookUp.SCHEMA_NAME);
    this.addForm.controls.TABLE_NAME.patchValue(this.lookUp.TABLE_NAME);
    this.addForm.controls.METADATA_VERSION.patchValue(this.lookUp.METADATA_VERSION);
    this.addForm.controls.LOOKUP_TABLE_ALIAS.patchValue(this.lookUp.LOOKUP_TABLE_ALIAS);
    const getLookUpTable = this.dimensionTables.filter(i => i.TABLE_NAME === this.lookUp.LOOKUP_TABLE_NAME);
    if (getLookUpTable && getLookUpTable.length) {
      this.addForm.controls.LOOKUP_TABLE_NAME.patchValue(getLookUpTable[0]);
      this.tableSelected(getLookUpTable[0].TABLE_NAME);
    }
    const joinKeys = this.lookUp.LOOKUP_JOIN_KEYS.split('=');
    const lookJoinKey1 = joinKeys[0].split('.')[1];
    if (lookJoinKey1) {
      const selectedJoinKey = this.tableColumns.filter(i => i.TARGET_COLUMN_NAME === lookJoinKey1);
      if (selectedJoinKey && selectedJoinKey.length) {
        this.addForm.controls.LOOKUP_JOIN_KEYS1.patchValue(selectedJoinKey[0]);
      }
    }

    const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
    let cols = localCopyOfVersion[`${this.selectedTable.METADATA_VERSION}_${this.selectedTable.TABLE_NAME}`];
    cols = cols.filter(i => i.LOOKUP_TABLE_ALIAS === this.lookUp.LOOKUP_TABLE_ALIAS);
    if (cols && cols.length) {
      this.addForm.controls.LOOKUP_COLUMNS.patchValue(cols);
    }
  }

  setDimensionJoinKey() {
    const joinKeys = this.lookUp.LOOKUP_JOIN_KEYS.split('=');
    const lookJoinKey2 = joinKeys[1].split('.')[1];
    if (lookJoinKey2) {
      const selectedJoinKey = this.dimensionTableColumns.filter(i => i.TARGET_COLUMN_NAME === lookJoinKey2);
      if (selectedJoinKey && selectedJoinKey.length) {
        this.addForm.controls.LOOKUP_JOIN_KEYS2.patchValue(selectedJoinKey[0]);
      }
    }
  }

  tableSelected(tableName) {
    this.errors.noValidatedVersion = null;
    this.dimensionTableColumns = [];
    this.getTableVersions(tableName);
    this.addForm.controls.LOOKUP_JOIN_KEYS2.patchValue('');
    this.addForm.controls.LOOKUP_COLUMNS.patchValue([]);
  }

  getTableVersions(tableName) {
    const request = {
      table_name: tableName
    };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
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
      if (this.action === 'view' || this.action === 'edit') {
        this.setDimensionJoinKey();
      }
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
    delete lookUpObject.PREFIX;
    // this.columnMetadataService.addLookUp({ data: lookUpObject }).subscribe((resp: any) => {
    //   if (!resp.error) {
    //     this.counter = this.counter + 1;
    //     if (this.counter === columnsToAdd.length + 1) {
    //       this.showToast('success', 'Successfully saved lookup!');
    //       this.closePopUp(true);
    //     }
    //   } else {
    //     this.showToast('error', 'Could not save lookup info.');
    //   }
    //   this.saveLookUpLoader = false;
    // }, error => {
    //   this.showToast('error', 'Could not save lookup info.');
    //   this.saveLookUpLoader = false;
    // });
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
      i.TARGET_COLUMN_NAME = `${columnsToAdd.PREFIX}_${i.TARGET_COLUMN_NAME}`;
      i.METADATA_VERSION = this.selectedTable.METADATA_VERSION;
      i.UPDATE_DATE = `${new Date()}`;
      return i;
    });
    for (const iterator of columnsToAdd) {
      this.addNewColumns(iterator, columnsToAdd);
    }

  }

  addNewColumns(column, columnsToAdd) {
    console.log("column ", column);
    // return this.columnMetadataService.addColumn({ data: column }).subscribe((resp: any) => {
    this.counter = this.counter + 1;
    if (this.counter === columnsToAdd.length + 1) {
      //     if (!resp.error && resp.data) {
      column.action = 'newColumn';
      const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
      localCopyOfVersion[`${column.METADATA_VERSION}_${column.TABLE_NAME}`].unshift(column);
      this.columnMetadataService.setLocalCopyOfVersion(localCopyOfVersion);
      //     }
      this.showToast('success', 'Successfully saved lookup!');
      this.closePopUp(true);
    }
    // }, error => {
    //   this.showToast('error', 'Could not save column info.');
    //   this.saveLookUpLoader = false;
    // });
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
