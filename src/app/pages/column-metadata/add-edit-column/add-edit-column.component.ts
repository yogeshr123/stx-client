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
    isEditMode: false
  };
  loader = {
    formData: false
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
    });
  }

  ngOnInit() {
    this.formInit();
    this.appState = JSON.parse(localStorage.getItem('appState'));
    if (this.routeInfo.versionId && this.routeInfo.id) {
      this.getColumnData();
    } else {
      if (this.appState && this.appState.CMV && this.appState.CMV.selectedTable) {
        this.TABLE_NAME = this.appState.CMV.selectedTable.TABLE_NAME;
        this.addEditColumnForm.controls.SCHEMA_NAME.patchValue(this.appState.CMV.selectedTable.SCHEMA_NAME);
        this.addEditColumnForm.controls.TABLE_NAME.patchValue(this.appState.CMV.selectedTable.TABLE_NAME);
        this.addEditColumnForm.controls.METADATA_VERSION.patchValue(this.appState.CMV.selectedTable.METADATA_VERSION);
      }
    }
  }

  formInit() {
    this.addEditColumnForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      METADATA_VERSION: ['', Validators.required],
      SRC_COLUMN_NAME: ['', Validators.required],
      SRC_COLUMN_TYPE: ['', Validators.required],
      SRC_DATA_TYPE: ['', Validators.required],
      SRC_PRECISION: ['', Validators.required],
      SRC_SCALE: ['', Validators.required],
      INTERNAL_COLUMN: [0, Validators.required],
      DERIVED_COLUMN_FORMULA: ['', Validators.required],
      LOOKUP_TABLE_ALIAS: [''],
      PREDEFINED_VALUE: ['', Validators.required],
      TARGET_COLUMN_NAME: ['', Validators.required],
      TARGET_DATA_TYPE: ['', Validators.required],
      TARGET_LENGTH: ['', Validators.required],
      TARGET_PRECISION: ['', Validators.required],
      TARGET_SCALE: ['', Validators.required],
      TARGET_COLUMN_ID: ['1'],
      TARGET_DEFAULT_VALUE: [''],
      IS_PKEY_COLUMN: [0, Validators.required],
      IS_PARTITION_COLUMN: [0, Validators.required],
      IS_UPDATE_DATE_COLUMN: [0, Validators.required],
      IS_DATATYPE_CHANGED: [0, Validators.required],
      IS_RENAMED: [0, Validators.required],
      IS_NEW: [0, Validators.required]
    });
  }

  getColumnData() {
    this.loader.formData = true;
    const request = {
      columnVersion: this.routeInfo.versionId,
      targetColumnId: this.routeInfo.id
    };
    this.columnMetadataService.getSingleColumn(request).subscribe((resp: any) => {
      this.columnData = resp.data[0];
      this.TABLE_NAME = this.columnData.TABLE_NAME;
      if (this.columnData) {
        console.log('this.columnData ', this.columnData);
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
    console.log('this.addEditColumnForm.value ', this.addEditColumnForm.value);
  }

  checkFormValues(functionToCall) {
    console.log('this.addEditColumnForm.value ', this.addEditColumnForm.value);
    if (functionToCall === 'addColumn') {
      this.addEditColumnForm.controls.IS_NEW.patchValue(1);
    }
    if (this.addEditColumnForm.controls.SRC_COLUMN_NAME !== this.addEditColumnForm.controls.TARGET_COLUMN_NAME) {
      this.addEditColumnForm.controls.IS_RENAMED.patchValue(1);
    } else {
      this.addEditColumnForm.controls.IS_RENAMED.patchValue(0);
    }
    if (this.addEditColumnForm.controls.SRC_DATA_TYPE !== this.addEditColumnForm.controls.TARGET_DATA_TYPE) {
      this.addEditColumnForm.controls.IS_DATATYPE_CHANGED.patchValue(1);
    } else {
      this.addEditColumnForm.controls.IS_DATATYPE_CHANGED.patchValue(0);
    }
  }

  onSubmit() {
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
    const request: any = {
      table_name: this.TABLE_NAME,
      data: this.addEditColumnForm.value,
      targetColumnId: this.routeInfo.id || this.addEditColumnForm.value.METADATA_VERSION
    };
    this.checkFormValues(functionToCall);
    this.columnMetadataService[functionToCall](request).subscribe((res: any) => {
      if (!res.error) {
        this.showToast('success', messages.success);
        this.goBack();
      } else {
        this.showToast('error', messages.error);
      }
    }, error => {
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
