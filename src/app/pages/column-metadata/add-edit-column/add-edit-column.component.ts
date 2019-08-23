import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-column',
  templateUrl: './add-edit-column.component.html',
  styleUrls: ['./add-edit-column.component.css']
})
export class AddEditColumnComponent implements OnInit {

  addEditColumnForm: FormGroup;
  routeInfo = {
    path: '',
    id: '',
    versionId: '',
    isViewOnly: false,
    isEditMode: false,
    fromHeaderHash: false
  };
  loader = {
    formData: false,
    saveColumn: false
  };
  columnData: any;
  TABLE_NAME: any;
  appState: any;

  constructor(
    private messageService: MessageService,
    private columnMetadataService: ColumnMetadataService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.routeInfo.id = params.columnId;
      this.routeInfo.versionId = params.versionId;
    });
    this.route.url.subscribe(params => {
      this.routeInfo.path = params[0].path;
      if (this.routeInfo.path.indexOf('view') > -1) {
        this.routeInfo.isViewOnly = true;
      }
      if (this.routeInfo.path.indexOf('edit') > -1) {
        this.routeInfo.isEditMode = true;
      }
      if (params[1] && params[1].path.indexOf('fhh') > -1) {
        this.routeInfo.fromHeaderHash = true;
      }
    });
  }

  ngOnInit() {
    this.formInit();
    this.appState = JSON.parse(localStorage.getItem('appState'));
    if (this.appState && this.appState.CMV && this.appState.CMV.selectedTable) {
      this.TABLE_NAME = this.appState.CMV.selectedTable.TABLE_NAME;
      this.addEditColumnForm.controls.SCHEMA_NAME.patchValue(this.appState.CMV.selectedTable.SCHEMA_NAME);
      this.addEditColumnForm.controls.TABLE_NAME.patchValue(this.appState.CMV.selectedTable.TABLE_NAME);
      this.addEditColumnForm.controls.METADATA_VERSION.patchValue(this.appState.CMV.selectedTable.METADATA_VERSION);
    }
    if (this.routeInfo.versionId && (this.routeInfo.id || this.routeInfo.id === 'new')) {
      this.getColumnData();
    }
    if (this.routeInfo.fromHeaderHash) {
      this.getHeaderHashData();
    }
    this.getUserInfo();
  }

  formInit() {
    this.addEditColumnForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      METADATA_VERSION: ['', Validators.required],
      SRC_COLUMN_NAME: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z][a-z0-9-_]+$/)])],
      SRC_COLUMN_TYPE: ['MAPPED', Validators.required],
      SRC_DATA_TYPE: [''],
      SRC_LEFT_PRECISION: [0],
      SRC_RIGHT_PRECISION: [0],
      INTERNAL_COLUMN: [0, Validators.required],
      DERIVED_COLUMN_FORMULA: [''],
      LOOKUP_TABLE_ALIAS: ['', Validators.compose([Validators.pattern(/^[a-z][a-zA-Z0-9-_]+$/)])],
      PREDEFINED_VALUE: [''],
      TARGET_COLUMN_NAME: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9-_]+$/)])],
      TARGET_DATA_TYPE: ['', Validators.required],
      TARGET_LEFT_PRECISION: [0],
      TARGET_RIGHT_PRECISION: [0],
      IS_UPDATE_DATE_COLUMN: [''],
      TARGET_COLUMN_ID: [''],
      TARGET_DEFAULT_VALUE: [''],
      IS_PKEY_COLUMN: [0],
      IS_PARTITION_COLUMN: [0],
      IS_DATATYPE_CHANGED: [0],
      IS_RENAMED: [0],
      IS_NEW: [0],
      HEADER_HASH: [0],
      UPDATED_BY: ['User'],
      UPDATE_DATE: [new Date()],
    });
  }

  getUserInfo() {
    const appState = JSON.parse(localStorage.getItem('appState'));
    if (appState.loggedInUser && appState.loggedInUser.USER_NAME) {
      this.addEditColumnForm.controls.UPDATED_BY.patchValue(appState.loggedInUser.USER_NAME);
    }
  }

  getHeaderHashData() {
    if (this.appState && this.appState.header) {
      this.addEditColumnForm.controls.SCHEMA_NAME.patchValue(this.appState.header.SCHEMA_NAME);
      this.addEditColumnForm.controls.TABLE_NAME.patchValue(this.appState.header.TABLE_NAME);
      this.addEditColumnForm.controls.SRC_COLUMN_NAME.patchValue(this.appState.header.COLUMN_NAME.toLowerCase());
      this.addEditColumnForm.controls.TARGET_COLUMN_NAME.patchValue(this.appState.header.COLUMN_NAME.toLowerCase());
      this.addEditColumnForm.controls.SRC_DATA_TYPE.patchValue(this.appState.header.DATA_TYPE);
      this.addEditColumnForm.controls.TARGET_DATA_TYPE.patchValue(this.appState.header.DATA_TYPE);
      this.addEditColumnForm.controls.IS_NEW.patchValue(1);
      this.addEditColumnForm.controls.HEADER_HASH.patchValue(this.appState.header.HEADER_HASH);
    }
  }

  getColumnData() {
    this.loader.formData = true;
    this.columnData = this.columnMetadataService.getColumnToEdit();
    if (this.columnData) {
      this.TABLE_NAME = this.columnData.TABLE_NAME;
      const formControls = this.addEditColumnForm.controls;
      for (const key in formControls) {
        if (formControls.hasOwnProperty(key)) {
          const element = formControls[key];
          if (this.columnData[key] && Object.keys(this.columnData[key]).length > 0 && this.columnData[key].constructor === Object) {
            element.patchValue(this.columnData[key].data[0]);
          } else {
            element.patchValue(this.columnData[key]);
          }
        }
      }
      this.getUserInfo();
      // For Decimal & Varchar Precision
      if (this.columnData.TARGET_DATA_TYPE.indexOf('decimal') > -1) {
        const splitDataType = this.columnData.TARGET_DATA_TYPE.split('(');
        formControls.TARGET_DATA_TYPE.patchValue('decimal');
        splitDataType[1] = splitDataType[1].replace(')', '');
        const items = splitDataType[1].split(',');
        formControls.TARGET_LEFT_PRECISION.patchValue(items[0]);
        formControls.TARGET_RIGHT_PRECISION.patchValue(items[1]);
      }
      if (this.columnData.TARGET_DATA_TYPE.indexOf('varchar') > -1) {
        const splitDataType = this.columnData.TARGET_DATA_TYPE.split('(');
        formControls.TARGET_DATA_TYPE.patchValue('varchar');
        splitDataType[1] = splitDataType[1].replace(')', '');
        const items = splitDataType[1].split(',');
        formControls.TARGET_LEFT_PRECISION.patchValue(items[0]);
      }
      if (this.columnData.SRC_DATA_TYPE.indexOf('decimal') > -1) {
        const splitDataType = this.columnData.SRC_DATA_TYPE.split('(');
        formControls.SRC_DATA_TYPE.patchValue('decimal');
        splitDataType[1] = splitDataType[1].replace(')', '');
        const items = splitDataType[1].split(',');
        formControls.SRC_LEFT_PRECISION.patchValue(items[0]);
        formControls.SRC_RIGHT_PRECISION.patchValue(items[1]);
      }
      formControls.UPDATE_DATE.patchValue(new Date());
    }
    this.loader.formData = false;
  }

  updateValidation() {
    if (this.addEditColumnForm.value.SRC_COLUMN_TYPE === 'MAPPED') {
      this.addEditColumnForm.controls.SRC_DATA_TYPE.setValidators([Validators.required]);
      this.addEditColumnForm.controls.SRC_DATA_TYPE.updateValueAndValidity();
      this.addEditColumnForm.controls.PREDEFINED_VALUE.setValidators([]);
      this.addEditColumnForm.controls.PREDEFINED_VALUE.patchValue('');
      this.addEditColumnForm.controls.PREDEFINED_VALUE.updateValueAndValidity();
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.setValidators([]);
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.patchValue('');
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.updateValueAndValidity();
    }
    if (this.addEditColumnForm.value.SRC_COLUMN_TYPE === 'PREDEFINED') {
      this.addEditColumnForm.controls.PREDEFINED_VALUE.setValidators([Validators.required]);
      this.addEditColumnForm.controls.PREDEFINED_VALUE.updateValueAndValidity();
      this.addEditColumnForm.controls.SRC_DATA_TYPE.setValidators([]);
      this.addEditColumnForm.controls.SRC_DATA_TYPE.patchValue('');
      this.addEditColumnForm.controls.SRC_DATA_TYPE.updateValueAndValidity();
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.setValidators([]);
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.patchValue('');
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.updateValueAndValidity();
    }
    if (this.addEditColumnForm.value.SRC_COLUMN_TYPE === 'DERIVED') {
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.setValidators([Validators.required]);
      this.addEditColumnForm.controls.DERIVED_COLUMN_FORMULA.updateValueAndValidity();
      this.addEditColumnForm.controls.PREDEFINED_VALUE.setValidators([]);
      this.addEditColumnForm.controls.PREDEFINED_VALUE.patchValue('');
      this.addEditColumnForm.controls.PREDEFINED_VALUE.updateValueAndValidity();
      this.addEditColumnForm.controls.SRC_DATA_TYPE.setValidators([]);
      this.addEditColumnForm.controls.SRC_DATA_TYPE.patchValue('');
      this.addEditColumnForm.controls.SRC_DATA_TYPE.updateValueAndValidity();
    }
  }

  checkFormValues(functionToCall, formValues) {
    if (functionToCall === 'addColumn') {
      formValues.IS_NEW = 1;
      formValues.action = 'newColumn';
    } else {
      formValues.action = this.routeInfo.id === 'new' ? 'newColumn' : 'updatedColumn';
    }
    if (formValues.SRC_COLUMN_NAME !== formValues.TARGET_COLUMN_NAME) {
      formValues.IS_RENAMED = 1;
    } else {
      formValues.IS_RENAMED = 0;
    }
    if (formValues.SRC_DATA_TYPE !== formValues.TARGET_DATA_TYPE) {
      formValues.IS_DATATYPE_CHANGED = 1;
    } else {
      formValues.IS_DATATYPE_CHANGED = 0;
    }
  }

  addPrecisionValues(formValues) {
    if (/decimal/g.test(formValues.TARGET_DATA_TYPE)) {
      formValues.TARGET_DATA_TYPE =
        `${formValues.TARGET_DATA_TYPE}(${formValues.TARGET_LEFT_PRECISION || 0},${formValues.TARGET_RIGHT_PRECISION || 0})`;
    }
    if (/varchar/g.test(formValues.TARGET_DATA_TYPE)) {
      formValues.TARGET_DATA_TYPE =
        `${formValues.TARGET_DATA_TYPE}(${formValues.TARGET_LEFT_PRECISION || 0})`;
    }
    if (/decimal/g.test(formValues.SRC_DATA_TYPE)) {
      formValues.SRC_DATA_TYPE =
        `${formValues.SRC_DATA_TYPE}(${formValues.SRC_LEFT_PRECISION || 0},${formValues.SRC_RIGHT_PRECISION || 0})`;
    }
  }

  onSubmit() {
    this.loader.saveColumn = true;
    let functionToCall: any = 'addColumn';
    let messages = {
      success: 'Column Add!',
      error: 'Could not add column.'
    };
    if (this.routeInfo.id) {
      functionToCall = 'updateColumn';
      messages = {
        success: 'Column Updated!',
        error: 'Could not update column.'
      };
    }
    const formValues = Object.assign({}, this.addEditColumnForm.value);
    this.addPrecisionValues(formValues);
    this.checkFormValues(functionToCall, formValues);

    if (this.routeInfo.fromHeaderHash) {
      const request = {
        data: formValues,
        fromHeaderHash: true
      };
      this.columnMetadataService.addColumn(request).subscribe((resp: any) => {
        if (resp && !resp.error) {
          this.showToast('success', 'Column Successfuly saved!');
          setTimeout(() => {
            localStorage.removeItem('localCopyOfVersion');
            this.loader.saveColumn = false;
            this.goBack();
          }, 2000);
        }
      }, error => {
        this.showToast('error', error.error.message);
        this.loader.saveColumn = false;
      });
    } else {

      const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
      if (functionToCall === 'addColumn') {
        localCopyOfVersion[`${formValues.METADATA_VERSION}_${this.TABLE_NAME}`].unshift(formValues);
      } else {
        localCopyOfVersion[`${formValues.METADATA_VERSION}_${this.TABLE_NAME}`] =
          localCopyOfVersion[`${formValues.METADATA_VERSION}_${this.TABLE_NAME}`]
            .map(i => {
              if (i.TARGET_COLUMN_ID === formValues.TARGET_COLUMN_ID) {
                i = formValues;
              }
              return i;
            });
      }

      this.columnMetadataService.setLocalCopyOfVersion(localCopyOfVersion);
      this.loader.saveColumn = false;
      this.goBack();
    }
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }

}
