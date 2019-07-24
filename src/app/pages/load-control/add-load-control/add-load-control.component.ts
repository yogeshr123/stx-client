import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../../services/record.service';
import { Router } from '@angular/router';
import { LoadControl } from '../../../model/load-control';
import { LoadControlService } from '../../../services/load-control.service';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from '../../../services/db-endpoints.service';
declare var $: any;

@Component({
  selector: 'app-add-load-control',
  templateUrl: './add-load-control.component.html',
  styleUrls: ['./add-load-control.component.css'],
})
export class AddLoadControlComponent implements OnInit {
  addLoadControlForm: FormGroup;
  submitted = false;
  record: any;
  loadControl: any;
  dbEndpoints: any[];
  temprecord = { "SCHEMA_NAME": "DRIVE", "TABLE_NAME": "P250_ERROR_RATE_BY_ZONE_FACT", "ENV_NAME": "PRD", "TARGET_SCHEMA_NAME": "DRIVE", "TARGET_TABLE_NAME": "P250_TEST", "EMAIL_ALERTS": "Y", "TABLE_SOURCE": "RAW_FACTORY", "LOAD_STRATEGY": "SAMPLED", "RAW_FACTORY_PATH": "s3://stx-usw2-ehc-prd-data-staging/p250_error_rate_by_zone/t0/", "RAW_FACTORY_RETENTION_STRATEGY": "GLACIER", "RAW_FACTORY_RETENTION_DAYS": 1830, "DB_ID": null, "DB_SCHEMA": null, "DB_TABLE": null, "DB_TABLE_PK_COLUMNS": null, "DB_TABLE_UPDATE_DATE_COLUMN": null, "T1_PATH": "s3://stx-usw2-ehc-prd-data-t1/drive.db_p250_error_rate_by_zone_fact/", "T1_RETENTION_STRATEGY": "DELETE", "T1_RETENTION_DAYS": 30, "T2_T3_RETENTION_STRATEGY": "NONE", "T2_T3_RETENTION_DAYS": null, "ETL_STATUS": "TODO", "ETL_DAG_NAME": null, "ETL_DAG_RUN_ID": null, "ETL_DAG_RUN_URL": null, "ETL_PROCESS_START_DATE": null, "ETL_PROCESS_END_DATE": null, "ETL_EXECUTION_STATUS": "NONE", "ETL_PROCESS": null, "T1_STATUS": "TODO", "T1_BATCH_IN_DAYS": 1, "T1_MAX_LOAD_END_DATE": "1990-01-01T00:00:00.000Z", "T1_CLUSTER_ID": null, "T1_LIVY_BATCH_ID": null, "T1_SPARK_APP_ID": null, "T1_SPARK_UI_URL": null, "T1_SPARK_LOG_URL": null, "T1_PROCESS_START_DATE": null, "T1_PROCESS_END_DATE": null, "T1_EXECUTION_STATUS": "TODO", "T1_ERROR": null, "T1_ERROR_TRACE": null, "T2_STATUS": "TODO", "T2_INSERT_DIR_BATCH_SIZE": 10000, "T2_PARTITION_JOB_TYPE": "SINGLE", "T2_MAX_LOAD_END_DATE": "1970-01-01T00:00:01.000Z", "T2_MAX_ATLAS_VERSION": 0, "T2_CLUSTER_ID": null, "T2_LIVY_BATCH_ID": null, "T2_SPARK_APP_ID": null, "T2_SPARK_UI_URL": null, "T2_SPARK_LOG_URL": null, "T2_PROCESS_START_DATE": "2019-06-07T08:22:55.000Z", "T2_PROCESS_END_DATE": "2019-06-07T08:22:55.000Z", "T2_EXECUTION_STATUS": "TODO", "T2_ERROR": null, "T2_ERROR_TRACE": null, "ANALYZE_STATUS": "NONE", "ANALYZE_EXECUTION_DAYS": 7, "ANALYZE_LAST_SUCCESS_DATE": null, "ANALYZE_PROCESS_START_DATE": null, "ANALYZE_PROCESS_END_DATE": null, "ANALYZE_EXECUTION_STATUS": "NONE", "ANALYZE_ERROR": null, "ANALYZE_ERROR_TRACE": null, "UPDATE_DATE": "2019-06-07T08:22:55.000Z", "UPDATED_BY": "USER" };
  constructor(
    private formBuilder: FormBuilder,
    private recordService: RecordService,
    private router: Router,
    private loadControlService: LoadControlService,
    private messageService: MessageService,
    private dbEndpointsService: DBEndpointsService
  ) {
    this.loadControl = LoadControl;
  }
  ngOnInit() {
    this.loadDBEndpoints();
    this.formInit();
    this.setTableSourceValidators();
    this.setRetentionStrategyValidators();
  }

  ngOnDestroy() {
    // this.record = null;
  }

  formInit() {
    this.addLoadControlForm = this.formBuilder.group({
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
      ETL_STATUS: [''],
      ETL_STATUS_REASON: [''],
      ETL_EXECUTION_STATUS: ['TODO'],
      T1_PATH: [''],
      T1_RETENTION_STRATEGY: [''],
      T1_RETENTION_DAYS: [0],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: ['', Validators.required],
      T1_MAX_LOAD_END_DATE: [''],
      T1_EXECUTION_STATUS: ['TODO'],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [0, Validators.required],
      T2_PARTITION_JOB_TYPE: ['SINGLE', Validators.required],
      T2_MAX_LOAD_END_DATE: [''],
      T2_EXECUTION_STATUS: ['TODO'],
      ANALYZE_STATUS: [''],
      ANALYZE_EXECUTION_DAYS: [0, Validators.required],
      ANALYZE_LAST_SUCCESS_DATE: [''],
      ANALYZE_EXECUTION_STATUS: ['TODO'],
      UPDATE_DATE: ['', Validators.required],
      UPDATED_BY: ['', Validators.required]
    });
  }

  setTableSourceValidators() {
    const DB_ID = this.addLoadControlForm.get('DB_ID');
    const DB_SCHEMA = this.addLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.addLoadControlForm.get('DB_TABLE');
    const DBDB_TABLE_PK_COLUMNS_SCHEMA = this.addLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.addLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const RAW_FACTORY_PATH = this.addLoadControlForm.get('RAW_FACTORY_PATH');

    this.addLoadControlForm.get('TABLE_SOURCE').valueChanges
      .subscribe(TABLE_SOURCE => {

        if (TABLE_SOURCE === 'ORACLE') {
          DB_ID.setValidators([Validators.required]);
          DB_SCHEMA.setValidators([Validators.required]);
          DB_TABLE.setValidators([Validators.required]);
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators([Validators.required]);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators([Validators.required]);

          RAW_FACTORY_PATH.setValidators(null);
        }

        if (TABLE_SOURCE === 'RAW_FACTORY') {
          DB_ID.setValidators(null);
          DB_SCHEMA.setValidators(null);
          DB_TABLE.setValidators(null);
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators(null);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators(null);

          RAW_FACTORY_PATH.setValidators([Validators.required]);
        }

        DB_ID.updateValueAndValidity();
        DB_SCHEMA.updateValueAndValidity();
        DB_TABLE.updateValueAndValidity();
        DBDB_TABLE_PK_COLUMNS_SCHEMA.updateValueAndValidity();
        DB_TABLE_UPDATE_DATE_COLUMN.updateValueAndValidity();
        RAW_FACTORY_PATH.updateValueAndValidity();
      });
  }

  setRetentionStrategyValidators() {
    this.addLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY').valueChanges
      .subscribe(RAW_FACTORY_RETENTION_STRATEGY => {
        const RAW_FACTORY_RETENTION_DAYS = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
        if (RAW_FACTORY_RETENTION_STRATEGY !== 'NONE') {
          RAW_FACTORY_RETENTION_DAYS.setValidators([Validators.min(1)]);
        }
        else {
          RAW_FACTORY_RETENTION_DAYS.setValidators(null);
        }

        RAW_FACTORY_RETENTION_DAYS.updateValueAndValidity();
      });

    this.addLoadControlForm.get('T1_RETENTION_STRATEGY').valueChanges
      .subscribe(T1_RETENTION_STRATEGY => {
        const T1_RETENTION_DAYS = this.addLoadControlForm.get('T1_RETENTION_DAYS');
        if (T1_RETENTION_STRATEGY !== 'NONE') {
          T1_RETENTION_DAYS.setValidators([Validators.min(1)]);
        }
        else {
          T1_RETENTION_DAYS.setValidators(null);
        }

        T1_RETENTION_DAYS.updateValueAndValidity();
      });

    this.addLoadControlForm.get('T2_T3_RETENTION_STRATEGY').valueChanges
      .subscribe(T2_T3_RETENTION_STRATEGY => {
        const T2_T3_RETENTION_DAYS = this.addLoadControlForm.get('T2_T3_RETENTION_DAYS');
        if (T2_T3_RETENTION_STRATEGY !== 'NONE') {
          T2_T3_RETENTION_DAYS.setValidators([Validators.min(1)]);
        }
        else {
          T2_T3_RETENTION_DAYS.setValidators(null);
        }

        T2_T3_RETENTION_DAYS.updateValueAndValidity();
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addLoadControlForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addLoadControlForm.invalid) {
      return;
    }

    const body = {
      record: this.addLoadControlForm.value
    };
    this.loadControlService.addRecord(body).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
      this.router.navigate(['/loadcontrol']);
    });
  }

  loadDBEndpoints() {
    this.dbEndpointsService.getEndpoints().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.dbEndpoints = data.data;
      }
    });
  }
}
