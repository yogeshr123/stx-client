import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../../services/record.service';
import { Router } from '@angular/router';
import { LoadControl } from '../../../model/load-control';
import { LoadControlService } from '../../../services/load-control.service';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from '../../../services/db-endpoints.service';
import { environment } from '../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-add-load-control',
  templateUrl: './add-load-control.component.html',
  styleUrls: ['./add-load-control.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddLoadControlComponent implements OnInit {
  addLoadControlForm: FormGroup;
  submitted = false;
  record: any;
  loadControl: any;
  dbEndpoints: any[];
  temprecord = { "SCHEMA_NAME": "DRIVE", "TABLE_NAME": "P250_ERROR_RATE_BY_ZONE_FACT", "ENV_NAME": "PRD", "TARGET_SCHEMA_NAME": "DRIVE", "TARGET_TABLE_NAME": "P250_TEST", "EMAIL_ALERTS": "Y", "TABLE_SOURCE": "RAW_FACTORY", "LOAD_STRATEGY": "SAMPLED", "RAW_FACTORY_PATH": "s3://stx-usw2-ehc-prd-data-staging/p250_error_rate_by_zone/t0/", "RAW_FACTORY_RETENTION_STRATEGY": "GLACIER", "RAW_FACTORY_RETENTION_DAYS": 1830, "DB_ID": null, "DB_SCHEMA": null, "DB_TABLE": null, "DB_TABLE_PK_COLUMNS": null, "DB_TABLE_UPDATE_DATE_COLUMN": null, "T1_PATH": "s3://stx-usw2-ehc-prd-data-t1/drive.db_p250_error_rate_by_zone_fact/", "T1_RETENTION_STRATEGY": "DELETE", "T1_RETENTION_DAYS": 30, "T2_T3_RETENTION_STRATEGY": "NONE", "T2_T3_RETENTION_DAYS": null, "ETL_STATUS": "TODO", "ETL_DAG_NAME": null, "ETL_DAG_RUN_ID": null, "ETL_DAG_RUN_URL": null, "ETL_PROCESS_START_DATE": null, "ETL_PROCESS_END_DATE": null, "ETL_EXECUTION_STATUS": "NONE", "ETL_PROCESS": null, "T1_STATUS": "TODO", "T1_BATCH_IN_DAYS": 1, "T1_MAX_LOAD_END_DATE": "1990-01-01T00:00:00.000Z", "T1_CLUSTER_ID": null, "T1_LIVY_BATCH_ID": null, "T1_SPARK_APP_ID": null, "T1_SPARK_UI_URL": null, "T1_SPARK_LOG_URL": null, "T1_PROCESS_START_DATE": null, "T1_PROCESS_END_DATE": null, "T1_EXECUTION_STATUS": "TODO", "T1_ERROR": null, "T1_ERROR_TRACE": null, "T2_STATUS": "TODO", "T2_INSERT_DIR_BATCH_SIZE": 10000, "T2_PARTITION_JOB_TYPE": "SINGLE", "T2_MAX_LOAD_END_DATE": "1970-01-01T00:00:01.000Z", "T2_MAX_ATLAS_VERSION": 0, "T2_CLUSTER_ID": null, "T2_LIVY_BATCH_ID": null, "T2_SPARK_APP_ID": null, "T2_SPARK_UI_URL": null, "T2_SPARK_LOG_URL": null, "T2_PROCESS_START_DATE": "2019-06-07T08:22:55.000Z", "T2_PROCESS_END_DATE": "2019-06-07T08:22:55.000Z", "T2_EXECUTION_STATUS": "TODO", "T2_ERROR": null, "T2_ERROR_TRACE": null, "ANALYZE_STATUS": "NONE", "ANALYZE_EXECUTION_DAYS": 7, "ANALYZE_LAST_SUCCESS_DATE": null, "ANALYZE_PROCESS_START_DATE": null, "ANALYZE_PROCESS_END_DATE": null, "ANALYZE_EXECUTION_STATUS": "NONE", "ANALYZE_ERROR": null, "ANALYZE_ERROR_TRACE": null, "UPDATE_DATE": "2019-06-07T08:22:55.000Z", "UPDATED_BY": "USER" };
  s3UrlPattern = "^s3://([^/]+)/(.*?([^/]+)/?)$";
  recordMeta: any;

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
    this.getColumnDataType();
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
      RAW_FACTORY_PATH: ['', Validators.pattern(this.s3UrlPattern)],
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
      T1_PATH: ['', Validators.pattern(this.s3UrlPattern)],
      T1_RETENTION_STRATEGY: [''],
      T1_RETENTION_DAYS: [0],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: ['', Validators.required],
      T1_MAX_LOAD_END_DATE: [null, Validators.required],
      T1_EXECUTION_STATUS: ['TODO'],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [0, Validators.required],
      T2_PARTITION_JOB_TYPE: ['SINGLE', Validators.required],
      T2_MAX_LOAD_END_DATE: [null],
      T2_EXECUTION_STATUS: ['TODO'],
      ANALYZE_STATUS: [''],
      ANALYZE_EXECUTION_DAYS: [0, Validators.required],
      ANALYZE_LAST_SUCCESS_DATE: [null],
      ANALYZE_EXECUTION_STATUS: ['TODO'],
      UPDATE_DATE: [{ value: null, disabled: true }, Validators.required],
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
    const RAW_FACTORY_RETENTION_STRATEGY = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY');
    const RAW_FACTORY_RETENTION_DAYS = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');

    this.addLoadControlForm.get('TABLE_SOURCE').valueChanges
      .subscribe(TABLE_SOURCE => {

        if (TABLE_SOURCE === 'ORACLE') {
          DB_ID.setValidators([Validators.required]);
          DB_SCHEMA.setValidators([Validators.required]);
          DB_TABLE.setValidators([Validators.required]);
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators([Validators.required]);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators([Validators.required]);

          DB_ID.enable();
          DB_SCHEMA.enable();
          DB_TABLE.enable();
          DBDB_TABLE_PK_COLUMNS_SCHEMA.enable();
          DB_TABLE_UPDATE_DATE_COLUMN.enable();

          RAW_FACTORY_PATH.setValidators(null);
          RAW_FACTORY_PATH.disable();
          RAW_FACTORY_RETENTION_STRATEGY.disable();
          RAW_FACTORY_RETENTION_DAYS.disable();
        }

        if (TABLE_SOURCE === 'RAW_FACTORY') {
          DB_ID.setValidators(null);
          DB_SCHEMA.setValidators(null);
          DB_TABLE.setValidators(null);
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators(null);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators(null);

          DB_ID.disable();
          DB_SCHEMA.disable();
          DB_TABLE.disable();
          DBDB_TABLE_PK_COLUMNS_SCHEMA.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();

          RAW_FACTORY_PATH.setValidators([Validators.required, Validators.pattern(this.s3UrlPattern)]);
          RAW_FACTORY_PATH.enable();
          RAW_FACTORY_RETENTION_STRATEGY.enable();
          RAW_FACTORY_RETENTION_DAYS.enable();
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
          RAW_FACTORY_RETENTION_DAYS.enable();
        }
        else {
          RAW_FACTORY_RETENTION_DAYS.setValidators(null);
          RAW_FACTORY_RETENTION_DAYS.disable();
        }

        RAW_FACTORY_RETENTION_DAYS.updateValueAndValidity();
      });

    this.addLoadControlForm.get('T1_RETENTION_STRATEGY').valueChanges
      .subscribe(T1_RETENTION_STRATEGY => {
        const T1_RETENTION_DAYS = this.addLoadControlForm.get('T1_RETENTION_DAYS');
        if (T1_RETENTION_STRATEGY !== 'NONE') {
          T1_RETENTION_DAYS.setValidators([Validators.min(1)]);
          T1_RETENTION_DAYS.enable();
        }
        else {
          T1_RETENTION_DAYS.setValidators(null);
          T1_RETENTION_DAYS.disable();
        }

        T1_RETENTION_DAYS.updateValueAndValidity();
      });

    this.addLoadControlForm.get('T2_T3_RETENTION_STRATEGY').valueChanges
      .subscribe(T2_T3_RETENTION_STRATEGY => {
        const T2_T3_RETENTION_DAYS = this.addLoadControlForm.get('T2_T3_RETENTION_DAYS');
        if (T2_T3_RETENTION_STRATEGY !== 'NONE') {
          T2_T3_RETENTION_DAYS.setValidators([Validators.min(1)]);
          T2_T3_RETENTION_DAYS.enable();
        }
        else {
          T2_T3_RETENTION_DAYS.setValidators(null);
          T2_T3_RETENTION_DAYS.disable();
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

    let formValues = Object.assign({}, this.addLoadControlForm.value);
    formValues.UPDATE_DATE = new Date();
    for (const key in formValues) {
      const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
      const dataType = this.recordMeta[index].DATA_TYPE;
      if (formValues[key]) {
        if (dataType == "timestamp") {
          formValues[key] = `${formValues[key]}`;
        }
      }
    }

    const body = {
      record: formValues
    };
    this.loadControlService.addRecord(body).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'record saved', life: 3000 });
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

  autoGenerateS3Url(type) {
    if (type === "RAW_FACTORY_PATH") {
      const TABLE_NAME = this.addLoadControlForm.get('TABLE_NAME');
      const RAW_FACTORY_PATH = this.addLoadControlForm.get('RAW_FACTORY_PATH');
      let TABLE_NAMEString = TABLE_NAME.value.trim();
      if (undefined != TABLE_NAMEString && null != TABLE_NAMEString && TABLE_NAMEString != "") {
        if (TABLE_NAMEString.lastIndexOf("_FACT") > 0) {
          TABLE_NAMEString = (TABLE_NAMEString.substring(0, TABLE_NAMEString.lastIndexOf("_FACT"))).toLowerCase();
        }
        else {
          TABLE_NAMEString = TABLE_NAMEString.toLowerCase();
        }
        const url = `s3://${environment.RAW_FACTORY_PATH_DEFAULT_SETTING}/${TABLE_NAMEString}/t0/`;
        RAW_FACTORY_PATH.setValue(url);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Please provide TABLE_NAME', life: 3000 });
      }
    }
    else if (type === "T1_PATH") {
      //<T1_PATH_DEFAULT_SETTING>/lowercase(<schema>.db_<table_name>)/
      const TABLE_NAME = this.addLoadControlForm.get('TABLE_NAME');
      const TABLE_NAMEString = TABLE_NAME.value.trim();
      const SCHEMA_NAME = this.addLoadControlForm.get('SCHEMA_NAME');
      const SCHEMA_NAMEString = SCHEMA_NAME.value.trim();
      const T1_PATH = this.addLoadControlForm.get('T1_PATH');

      if (undefined != TABLE_NAMEString && null != TABLE_NAMEString && TABLE_NAMEString != "" &&
        undefined != SCHEMA_NAMEString && null != SCHEMA_NAMEString && SCHEMA_NAMEString != "") {
        const urlString = (`${SCHEMA_NAMEString}.db_${TABLE_NAMEString}`).toLowerCase();
        const url = `s3://${environment.T1_PATH_DEFAULT_SETTING}/${urlString}/`;
        T1_PATH.setValue(url);
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Please provide TABLE_NAME and SCHEMA_NAME', life: 3000 });
      }
    }
  }

  getColumnDataType() {
    this.loadControlService.getColumnDataType().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordMeta = data.data;
      }
    });
  }
}
