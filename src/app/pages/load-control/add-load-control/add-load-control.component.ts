import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../../services/record.service';
import { Router } from '@angular/router';
import { LoadControl } from '../../../model/load-control';
import { LoadControlService } from '../../../services/load-control.service';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from '../../../services/db-endpoints.service';
import { environment } from '../../../../environments/environment';
import { ClustersService } from 'src/app/services/clusters.service';
import { CommonService } from 'src/app/services/common.service';
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
  clusters: any[];
  s3UrlPattern = "^s3://([^/]+)/(.*?([^/]+)/?)$";
  recordMeta: any;
  appState: any;
  tableRegex = "[A-Za-z][A-Za-z0-9_]*"; //"[A-Za-z0-9_]+";
  factSchemaNamesBackup: any;
  factSchemaNames: any;
  factTablesNames: any;

  constructor(
    private formBuilder: FormBuilder,
    private recordService: RecordService,
    private router: Router,
    private loadControlService: LoadControlService,
    private messageService: MessageService,
    private dbEndpointsService: DBEndpointsService,
    private clustersService: ClustersService,
    private commonService: CommonService
  ) {
    this.loadControl = LoadControl;
  }
  ngOnInit() {
    this.appState = this.commonService.getState();
    this.loadDBEndpoints();
    this.getClusters();
    this.formInit();
    this.setTableSourceValidators();
    this.setRetentionStrategyValidators();
    this.setSchemaAndTableValues();
    this.setLoadStrategyValidators();
    this.getColumnDataType();
    this.getUserInfo();
    this.getFactTablesData();
  }

  ngOnDestroy() {
    // this.record = null;
  }

  getUserInfo() {
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      this.addLoadControlForm.controls.UPDATED_BY.patchValue(this.appState.loggedInUser.USER_NAME);
    }
  }

  formInit() {
    this.addLoadControlForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      TABLE_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      ENV_NAME: ['', Validators.required],
      TARGET_SCHEMA_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      TARGET_TABLE_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      EMAIL_ALERTS: ['Y', Validators.required],
      TABLE_SOURCE: ['', Validators.required],
      LOAD_STRATEGY: ['', Validators.required],
      FACT_SCHEMA_NAME: [''],
      FACT_TABLE_NAME: [''],
      FACT_ENV_NAME: [''],
      RAW_FACTORY_PATH: ['', Validators.pattern(this.s3UrlPattern)],
      RAW_FACTORY_MAX_LANDING_DATE: [null],
      RAW_FACTORY_RETENTION_STRATEGY: [''],
      RAW_FACTORY_RETENTION_DAYS: [0],
      DB_ID: [''],
      DB_SCHEMA: [''],
      DB_TABLE: [''],
      DB_TABLE_PK_COLUMNS: [''],
      DB_TABLE_UPDATE_DATE_COLUMN: [''],
      CHECK_INDEX_EXIST: ['1'],
      ETL_STATUS: ['NEW_TABLE'],
      ETL_STATUS_REASON: [''],
      ETL_EXECUTION_STATUS: ['TODO'],
      T1_PATH: ['', Validators.pattern(this.s3UrlPattern)],
      T1_RETENTION_STRATEGY: ['GLACIER'],
      T1_RETENTION_DAYS: [180, Validators.compose([Validators.min(1), Validators.max(10000)])],
      T1_STATUS: ['TODO'],
      T1_BATCH_IN_DAYS: ['1', Validators.required],
      T1_MAX_LOAD_END_DATE: [null],
      T1_CLUSTER_ID: ['', Validators.required],
      T1_EXECUTION_STATUS: ['TODO'],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      T2_STATUS: ['TODO'],
      T2_INSERT_DIR_BATCH_SIZE: [1000, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
      T2_INSERT_BATCH_FILE_SIZE_GB: [1000, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
      T2_PARTITION_JOB_TYPE: ['SINGLE', Validators.required],
      T2_MAX_LOAD_END_DATE: [null, Validators.required],
      T2_CLUSTER_ID: ['', Validators.required],
      T2_EXECUTION_STATUS: ['TODO'],
      ANALYZE_STATUS: ['TODO'],
      ANALYZE_EXECUTION_DAYS: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(30)])],
      ANALYZE_LAST_SUCCESS_DATE: [new Date()],
      ANALYZE_EXECUTION_STATUS: ['TODO'],
      UPDATE_DATE: [{ value: null, disabled: true }, Validators.required],
      UPDATED_BY: ['', Validators.required]
    });
  }

  getFactTablesData() {
    this.loadControlService.getRecords().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        const factSchemaNames = data.data;
        this.factSchemaNamesBackup = factSchemaNames.filter(i => i.LOAD_STRATEGY === 'INSERT' || i.LOAD_STRATEGY === 'UPDATE');
      }
    }, error => {
      this.showToast('error', 'Fact Table data Load Failed.');
    });
  }

  factENVSelected() {
    const factSchemas = this.factSchemaNamesBackup.filter(i => i.ENV_NAME === this.addLoadControlForm.value.FACT_ENV_NAME);
    this.factSchemaNames = this.removeDuplicates(factSchemas, 'SCHEMA_NAME');
  }

  factSchemaSelected() {
    const factTables = this.factSchemaNames.filter(i => i.SCHEMA_NAME === this.addLoadControlForm.value.FACT_SCHEMA_NAME);
    this.factTablesNames = this.removeDuplicates(factTables, 'TABLE_NAME');
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  etlStatusChanged() {
    if (this.addLoadControlForm.value.ETL_STATUS !== 'HOLD') {
      this.addLoadControlForm.controls.ETL_STATUS_REASON.patchValue('');
      this.addLoadControlForm.controls.ETL_STATUS_REASON.setValidators(null);
      this.addLoadControlForm.controls.ETL_STATUS_REASON.updateValueAndValidity();
    } else {
      this.addLoadControlForm.controls.ETL_STATUS_REASON.setValidators([Validators.required]);
      this.addLoadControlForm.controls.ETL_STATUS_REASON.updateValueAndValidity();
    }
  }

  setTableSourceValidators() {
    const DB_ID = this.addLoadControlForm.get('DB_ID');
    const DB_SCHEMA = this.addLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.addLoadControlForm.get('DB_TABLE');
    const DB_TABLE_PK_COLUMNS_SCHEMA = this.addLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.addLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const CHECK_INDEX_EXIST = this.addLoadControlForm.get('CHECK_INDEX_EXIST');
    const RAW_FACTORY_PATH = this.addLoadControlForm.get('RAW_FACTORY_PATH');
    const RAW_FACTORY_RETENTION_STRATEGY = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY');
    const RAW_FACTORY_RETENTION_DAYS = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
    const RAW_FACTORY_MAX_LANDING_DATE = this.addLoadControlForm.get('RAW_FACTORY_MAX_LANDING_DATE');

    this.addLoadControlForm.get('TABLE_SOURCE').valueChanges
      .subscribe(TABLE_SOURCE => {

        if (TABLE_SOURCE === 'ORACLE') {
          DB_ID.setValidators([Validators.required]);
          DB_SCHEMA.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          DB_TABLE.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          DB_TABLE_PK_COLUMNS_SCHEMA.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          CHECK_INDEX_EXIST.setValidators([Validators.required]);

          DB_ID.enable();
          DB_SCHEMA.enable();
          DB_TABLE.enable();
          DB_TABLE_PK_COLUMNS_SCHEMA.enable();
          DB_TABLE_UPDATE_DATE_COLUMN.enable();
          CHECK_INDEX_EXIST.enable();

          RAW_FACTORY_PATH.setValidators(null);
          RAW_FACTORY_PATH.disable();
          RAW_FACTORY_RETENTION_STRATEGY.disable();
          RAW_FACTORY_RETENTION_DAYS.disable();
          RAW_FACTORY_MAX_LANDING_DATE.disable();
        }

        if (TABLE_SOURCE === 'RAW_FACTORY') {
          DB_ID.setValidators(null);
          DB_SCHEMA.setValidators(null);
          DB_TABLE.setValidators(null);
          DB_TABLE_PK_COLUMNS_SCHEMA.setValidators(null);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators(null);
          CHECK_INDEX_EXIST.setValidators(null);

          DB_ID.disable();
          DB_SCHEMA.disable();
          DB_TABLE.disable();
          DB_TABLE_PK_COLUMNS_SCHEMA.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();
          CHECK_INDEX_EXIST.disable();

          RAW_FACTORY_PATH.setValidators([Validators.required, Validators.pattern(this.s3UrlPattern)]);
          RAW_FACTORY_PATH.enable();
          RAW_FACTORY_RETENTION_STRATEGY.enable();
          RAW_FACTORY_RETENTION_DAYS.enable();
          RAW_FACTORY_MAX_LANDING_DATE.enable();
        }

        DB_ID.updateValueAndValidity();
        DB_SCHEMA.updateValueAndValidity();
        DB_TABLE.updateValueAndValidity();
        DB_TABLE_PK_COLUMNS_SCHEMA.updateValueAndValidity();
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

  setSchemaAndTableValues() {
    const TARGET_SCHEMA_NAME = this.addLoadControlForm.get('TARGET_SCHEMA_NAME');
    const TARGET_TABLE_NAME = this.addLoadControlForm.get('TARGET_TABLE_NAME');
    const DB_SCHEMA = this.addLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.addLoadControlForm.get('DB_TABLE');
    let prevSchemaName = "", prevTableName = "";

    this.addLoadControlForm.get('SCHEMA_NAME').valueChanges
      .subscribe(SCHEMA_NAME => {
        if (TARGET_SCHEMA_NAME.value.trim() == "" || TARGET_SCHEMA_NAME.untouched) {
          TARGET_SCHEMA_NAME.setValue(SCHEMA_NAME);
        }
        if (DB_SCHEMA.value.trim() == "" || DB_SCHEMA.untouched) {
          DB_SCHEMA.setValue(SCHEMA_NAME);
        }
        prevSchemaName = SCHEMA_NAME;
      });
    this.addLoadControlForm.get('TABLE_NAME').valueChanges
      .subscribe(TABLE_NAME => {
        if (TARGET_TABLE_NAME.value.trim() == "" || TARGET_TABLE_NAME.untouched) {
          TARGET_TABLE_NAME.setValue(TABLE_NAME);
        }
        if (DB_TABLE.value.trim() == "" || DB_TABLE.untouched) {
          DB_TABLE.setValue(TABLE_NAME);
        }
        prevSchemaName = TABLE_NAME;
      });
  }

  loadStrategyUpdated() {
    const formControl = this.addLoadControlForm.controls;
    if (this.addLoadControlForm.value.LOAD_STRATEGY !== 'FLAT') {
      formControl.FACT_ENV_NAME.patchValue('');
      formControl.FACT_SCHEMA_NAME.patchValue('');
      formControl.FACT_TABLE_NAME.patchValue('');
    } else if (this.addLoadControlForm.value.LOAD_STRATEGY !== 'REFRESH') {

    } else {
      formControl.FACT_ENV_NAME.setValidators([Validators.required]);
      formControl.FACT_ENV_NAME.updateValueAndValidity();
      formControl.FACT_SCHEMA_NAME.setValidators([Validators.required]);
      formControl.FACT_SCHEMA_NAME.updateValueAndValidity();
      formControl.FACT_TABLE_NAME.setValidators([Validators.required]);
      formControl.FACT_TABLE_NAME.updateValueAndValidity();
    }
  }

  setLoadStrategyValidators() {
    const TABLE_SOURCE = this.addLoadControlForm.get('TABLE_SOURCE');
    const T1_STATUS = this.addLoadControlForm.get('T1_STATUS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.addLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const DB_TABLE_PK_COLUMNS = this.addLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const CHECK_INDEX_EXIST = this.addLoadControlForm.get('CHECK_INDEX_EXIST');
    const T1_MAX_LOAD_END_DATE = this.addLoadControlForm.get('T1_MAX_LOAD_END_DATE');
    const T1_CLUSTER_ID = this.addLoadControlForm.get('T1_CLUSTER_ID');
    const T2_INSERT_DIR_BATCH_SIZE = this.addLoadControlForm.get('T2_INSERT_DIR_BATCH_SIZE');
    const T2_INSERT_BATCH_FILE_SIZE_GB = this.addLoadControlForm.get('T2_INSERT_BATCH_FILE_SIZE_GB');
    const T1_BATCH_IN_DAYS = this.addLoadControlForm.get('T1_BATCH_IN_DAYS');

    this.addLoadControlForm.get('LOAD_STRATEGY').valueChanges
      .subscribe(LOAD_STRATEGY => {

        // Default
        DB_TABLE_PK_COLUMNS.enable();
        DB_TABLE_UPDATE_DATE_COLUMN.enable();
        T2_INSERT_BATCH_FILE_SIZE_GB.enable();
        T2_INSERT_DIR_BATCH_SIZE.enable();
        CHECK_INDEX_EXIST.enable();

        if (LOAD_STRATEGY === 'UPDATE') {
          T2_INSERT_BATCH_FILE_SIZE_GB.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
          T1_MAX_LOAD_END_DATE.updateValueAndValidity();
        } else if (LOAD_STRATEGY === 'INSERT') {
          T2_INSERT_BATCH_FILE_SIZE_GB.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
          T1_MAX_LOAD_END_DATE.updateValueAndValidity();
        } else if (LOAD_STRATEGY === 'SAMPLED') {
          TABLE_SOURCE.setValue('RAW_FACTORY');
          T1_STATUS.setValue('HOLD');
          T2_INSERT_DIR_BATCH_SIZE.disable();
          T1_BATCH_IN_DAYS.setValidators(null);
          T1_BATCH_IN_DAYS.updateValueAndValidity();
          T1_CLUSTER_ID.setValidators(null);
          T1_CLUSTER_ID.updateValueAndValidity();
        } else if (LOAD_STRATEGY === 'FLAT') {
          T1_STATUS.setValue('HOLD');
          TABLE_SOURCE.setValidators(null);
          TABLE_SOURCE.updateValueAndValidity();
          T1_BATCH_IN_DAYS.setValidators(null);
          T1_BATCH_IN_DAYS.updateValueAndValidity();
          T1_CLUSTER_ID.setValidators(null);
          T1_CLUSTER_ID.updateValueAndValidity();
        } else if (LOAD_STRATEGY === 'REFRESH') {
          DB_TABLE_PK_COLUMNS.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();
          CHECK_INDEX_EXIST.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
          T1_MAX_LOAD_END_DATE.updateValueAndValidity();
        } else {
          TABLE_SOURCE.setValue('ORACLE');
        }
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
      this.showToast('success', 'record saved.');
      this.router.navigate(['/loadcontrol']);
    }, error => {
      this.showToast('error', 'Could not save record.');
    });
  }

  loadDBEndpoints() {
    this.dbEndpointsService.getEndpoints().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.dbEndpoints = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  getClusters() {
    this.clustersService.getClusters().subscribe((resp: any) => {
      this.clusters = resp.data;
    }, error => {
      console.log('error ', error);
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
        this.showToast('error', 'Please provide TABLE_NAME.');
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
        this.showToast('error', 'Please provide TABLE_NAME and SCHEMA_NAME.');
      }
    }
  }

  getColumnDataType() {
    this.loadControlService.getColumnDataType().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordMeta = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}
