import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';

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

  constructor(
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
    if (this.routeInfo.versionId && this.routeInfo.id) {
      this.getColumnData();
    }
  }

  formInit() {
    this.addEditColumnForm = this.formBuilder.group({
      SCHEMA_NAME: '',
      TABLE_NAME: '',
      METADATA_VERSION: '',
      SRC_COLUMN_NAME: '',
      SRC_COLUMN_TYPE: '',
      SRC_DATA_TYPE: '',
      SRC_PRECISION: '',
      SRC_SCALE: '',
      INTERNAL_COLUMN: 0,
      DERIVED_COLUMN_FORMULA: '',
      LOOKUP_TABLE_ALIAS: '',
      PREDEFINED_VALUE: '',
      TARGET_COLUMN_NAME: '',
      TARGET_DATA_TYPE: '',
      TARGET_LENGTH: '',
      TARGET_PRECISION: '',
      TARGET_SCALE: '',
      TARGET_COLUMN_ID: '',
      TARGET_DEFAULT_VALUE: '',
      IS_PKEY_COLUMN: 0,
      IS_PARTITION_COLUMN: 0,
      IS_UPDATE_DATE_COLUMN: 0,
      IS_DATATYPE_CHANGED: 0,
      IS_RENAMED: 0,
      IS_NEW: 0
    });
  }

  getColumnData() {
    this.loader.formData = true;
    const request = {
      table_name: 'P250_ERROR_RATE_BY_ZONE_FACT',
      columnVersion: this.routeInfo.versionId,
      targetColumnId: this.routeInfo.id
    };
    this.columnMetadataService.getSingleColumn(request).subscribe((resp: any) => {
      this.columnData = resp.data[0];
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

  goBack() {
    this.location.back();
  }

}
