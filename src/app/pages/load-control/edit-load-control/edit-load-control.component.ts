import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../../services/record.service';
import { Router } from '@angular/router';
import { LoadControl } from '../../../model/load-control';
import { LoadControlService } from '../../../services/load-control.service';
declare var $: any;

@Component({
  selector: 'app-edit-load-control',
  templateUrl: './edit-load-control.component.html',
  styleUrls: ['./edit-load-control.component.css']
})

export class EditLoadControlComponent implements OnInit {
  editLoadControlForm: FormGroup;
  submitted = false;
  record: any;
  loadControl: any;
  recordMeta: any;
  constructor(
    private formBuilder: FormBuilder,
    private recordService: RecordService,
    private router: Router,
    private loadControlService: LoadControlService
  ) {
    this.loadControl = LoadControl;
  }
  ngOnInit() {
    this.formInit();

    this.recordService.currentRecord.subscribe(record => this.record = record);
    if (this.record) {
      this.loadRecordData();
    }
    else {
      this.router.navigate(['/loadcontrol/add']);
    }
  }

  formInit() {
    this.editLoadControlForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      ENV_NAME: ['', Validators.required],
      TARGET_SCHEMA_NAME: ['', Validators.required],
      TARGET_TABLE_NAME: ['', Validators.required],
      EMAIL_ALERTS: ['', Validators.required],
      TABLE_SOURCE: ['', Validators.required],
      LOAD_STRATEGY: ['', Validators.required],
      RAW_FACTORY_PATH: [''],
      RAW_FACTORY_RETENTION_STRATEGY: [''],
      RAW_FACTORY_RETENTION_DAYS: [0],
      DB_ID: [''],
      DB_SCHEMA: [''],
      DB_TABLE: [''],
      DB_TABLE_PK_COLUMNS: [''],
      DB_TABLE_UPDATE_DATE_COLUMN: [''],
      T1_PATH: [''],
      T1_RETENTION_STRATEGY: [''],
      T1_RETENTION_DAYS: [0],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      ETL_STATUS: [''],
      ETL_STATUS_REASON: [''],
      ETL_DAG_NAME: [''],
      ETL_DAG_RUN_ID: [''],
      ETL_DAG_RUN_URL: [''],
      ETL_PROCESS_START_DATE: [''],
      ETL_PROCESS_END_DATE: [''],
      ETL_EXECUTION_STATUS: [''],
      ETL_PROCESS: [''],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: [0, Validators.required],
      T1_MAX_LOAD_END_DATE: [''],
      T1_CLUSTER_ID: [''],
      T1_LIVY_BATCH_ID: [''],
      T1_SPARK_APP_ID: [''],
      T1_SPARK_UI_URL: [''],
      T1_SPARK_LOG_URL: [''],
      T1_PROCESS_START_DATE: [''],
      T1_PROCESS_END_DATE: [''],
      T1_EXECUTION_STATUS: [''],
      T1_ERROR: [''],
      T1_ERROR_TRACE: [''],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [0, Validators.required],
      T2_PARTITION_JOB_TYPE: ['', Validators.required],
      T2_MAX_LOAD_END_DATE: [''],
      T2_MAX_ATLAS_VERSION: [0],
      T2_CLUSTER_ID: [''],
      T2_LIVY_BATCH_ID: [''],
      T2_SPARK_APP_ID: [''],
      T2_SPARK_UI_URL: [''],
      T2_SPARK_LOG_URL: [''],
      T2_PROCESS_START_DATE: [''],
      T2_PROCESS_END_DATE: [''],
      T2_EXECUTION_STATUS: [''],
      T2_ERROR: [''],
      T2_ERROR_TRACE: [''],
      ANALYZE_STATUS: [''],
      ANALYZE_EXECUTION_DAYS: [0, Validators.required],
      ANALYZE_LAST_SUCCESS_DATE: [''],
      ANALYZE_PROCESS_START_DATE: [''],
      ANALYZE_PROCESS_END_DATE: [''],
      ANALYZE_EXECUTION_STATUS: [''],
      ANALYZE_ERROR: [''],
      ANALYZE_ERROR_TRACE: [''],
      UPDATE_DATE: ['', Validators.required],
      UPDATED_BY: ['', Validators.required]
    });
  }

  loadRecordData() {
    const body = {
      query: "SELECT distinct COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'table_load_control'"
    };
    this.loadControlService.getQueryResult(body).subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordMeta = data.data;
        // Set form data
        const formControls = this.editLoadControlForm.controls;
        for (const key in formControls) {
          if (formControls.hasOwnProperty(key)) {

            const element = formControls[key];
            const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
            const dataType = this.recordMeta[index].DATA_TYPE;
            if (this.record[key]) {
              if (dataType == "timestamp") {
                element.patchValue(new Date(this.record[key]));
              }
              else {
                element.patchValue(this.record[key]);
              }
            }
          }
        }
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editLoadControlForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editLoadControlForm.invalid) {
      return;
    }

    this.router.navigate(['/loadcontrol']);
  }

  ngOnDestroy() {
    this.record = null;
  }

  saveRecord(operation: string): void {
    console.log("After save click:" + this.record);
    const body = {
      operation: operation,
      record: this.record
    };
    this.router.navigate(['/loadcontrol']);
    // this.loadControlService.updateRecord(body).subscribe((data: any) => {
    //   console.log(data);
    // });
  }
}