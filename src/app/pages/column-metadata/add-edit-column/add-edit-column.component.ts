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
      this.routeInfo.versionId = '1'; // params.versionId;
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
    if (this.routeInfo.versionId && this.routeInfo.id) {
      this.getColumnData();
    }
    if (this.routeInfo.fromHeaderHash) {
      this.getHeaderHashData();
    }
  }

  formInit() {
    this.addEditColumnForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      METADATA_VERSION: ['', Validators.required],
      SRC_COLUMN_NAME: [{ value: '', disabled: this.routeInfo.fromHeaderHash }, Validators.required],
      SRC_COLUMN_TYPE: [
        {
          value: this.routeInfo.fromHeaderHash ? 'MAPPED' : '',
          disabled: this.routeInfo.fromHeaderHash
        },
        Validators.required],
      SRC_DATA_TYPE: [''],
      SRC_LEFT_PRECISION: [''],
      SRC_RIGHT_PRECISION: [''],
      INTERNAL_COLUMN: [0, Validators.required],
      DERIVED_COLUMN_FORMULA: [''],
      LOOKUP_TABLE_ALIAS: [''],
      PREDEFINED_VALUE: [''],
      TARGET_COLUMN_NAME: [{ value: '', disabled: this.routeInfo.fromHeaderHash }, Validators.required],
      TARGET_DATA_TYPE: ['', Validators.required],
      TARGET_LEFT_PRECISION: [''],
      TARGET_RIGHT_PRECISION: [''],
      IS_UPDATE_DATE_COLUMN: [''],
      TARGET_COLUMN_ID: ['1'],
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

  getHeaderHashData() {
    if (this.appState && this.appState.header) {
      this.addEditColumnForm.controls.SCHEMA_NAME.patchValue(this.appState.header.SCHEMA_NAME);
      this.addEditColumnForm.controls.TABLE_NAME.patchValue(this.appState.header.TABLE_NAME);
      this.addEditColumnForm.controls.SRC_COLUMN_NAME.patchValue(this.appState.header.COLUMN_NAME);
      this.addEditColumnForm.controls.TARGET_COLUMN_NAME.patchValue(this.appState.header.COLUMN_NAME);
      this.addEditColumnForm.controls.SRC_DATA_TYPE.patchValue(this.appState.header.DATA_TYPE);
      this.addEditColumnForm.controls.TARGET_DATA_TYPE.patchValue(this.appState.header.DATA_TYPE);
      this.addEditColumnForm.controls.IS_NEW.patchValue(1);
      this.addEditColumnForm.controls.HEADER_HASH.patchValue(this.appState.header.HEADER_HASH);
    }
  }

  getColumnData() {
    this.loader.formData = true;
    const request = {
      table_name: this.TABLE_NAME,
      columnVersion: this.routeInfo.versionId,
      targetColumnId: this.routeInfo.id
    };
    this.columnMetadataService.getSingleColumn(request).subscribe((resp: any) => {
      this.columnData = resp.data[0];
      this.TABLE_NAME = this.columnData.TABLE_NAME;
      if (this.columnData) {
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
      }
      this.loader.formData = false;
    }, error => {
      this.loader.formData = false;
    });
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
    const request: any = {
      table_name: this.TABLE_NAME,
      data: formValues,
      targetColumnId: this.routeInfo.id || formValues.METADATA_VERSION,
      fromHeaderHash: this.routeInfo.fromHeaderHash
    };
    this.checkFormValues(functionToCall, formValues);
    this.columnMetadataService[functionToCall](request).subscribe((res: any) => {
      if (!res.error) {
        this.showToast('success', messages.success);
        setTimeout(() => {
          this.goBack();
        }, 1500);
      } else {
        this.showToast('error', messages.error);
      }
      this.loader.saveColumn = false;
    }, error => {
      this.loader.saveColumn = false;
      this.showToast('error', messages.error);
    });
  }

  goBack() {
    this.location.back();
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
