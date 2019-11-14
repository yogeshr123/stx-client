import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../../../services/record.service';
import { Router } from '@angular/router';
import { LoadControl } from '../../../model/load-control';
import { LoadControlService } from '../../../services/load-control.service';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ClustersService } from 'src/app/services/clusters.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
declare var $: any;
import { DialogService, ConfirmationService } from 'primeng/api';
import { SparkConfigService } from 'src/app/services/spark-config.service';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';

@Component({
  selector: 'app-edit-load-control',
  templateUrl: './edit-load-control.component.html',
  styleUrls: ['./edit-load-control.component.css'],
  providers: [DialogService, ConfirmationService]
})

export class EditLoadControlComponent implements OnInit {
  editLoadControlForm: FormGroup;
  submitted = false;
  newRecord = false;
  record: any;
  loadControl: any;
  recordMeta: any;
  s3UrlPattern = "^s3://([^/]+)/(.*?([^/]+)/?)$";
  dbEndpoints: any[];
  clusters: any[];
  sparkConfigId: any[];
  isEdit = false;
  appState: any;
  tableRegex = "[A-Za-z][A-Za-z0-9_]*";
  tableColumnRegex = "[A-Za-z][A-Za-z0-9_, ]*";
  factSchemaNamesBackup: any;
  factSchemaNames: any;
  factTablesNames: any;
  tableInfo: any;
  emails: any;

  constructor(
    private sparkConfigService: SparkConfigService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private recordService: RecordService,
    private router: Router,
    private loadControlService: LoadControlService,
    private dbEndpointsService: DBEndpointsService,
    private messageService: MessageService,
    private commonService: CommonService,
    private clustersService: ClustersService
  ) {
    this.loadControl = LoadControl;
  }
  ngOnInit() {
    this.formInit();
    this.appState = this.commonService.getState();
    this.loadDBEndpoints();
    this.getClusters();
    this.getSparkConfig();
    this.setTableSourceValidators();
    this.setRetentionStrategyValidators();
    if (this.appState.selectedRecord && this.appState.selectedRecord.record) {
      this.record = this.appState.selectedRecord.record;
      this.isEdit = this.appState.selectedRecord.edit;
      this.getColumnDataTypeAndSetFormValues();
      this.getTableData();
    } else {
      this.router.navigate(['/loadcontrol/add']);
    }
    this.getFactTablesData();
    this.getEmails();
    this.setLoadStrategyValidators();
  }

  ngOnDestroy() {
    delete this.appState.selectedRecord;
    this.commonService.setState(this.appState);
  }

  getUserInfo() {
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      this.editLoadControlForm.controls.UPDATED_BY.patchValue(this.appState.loggedInUser.USER_NAME);
    }
  }

  formInit() {
    this.editLoadControlForm = this.formBuilder.group({
      SCHEMA_NAME: [{ value: '', disabled: true }],
      TABLE_NAME: [{ value: '', disabled: true }],
      ENV_NAME: [{ value: 'PRD', disabled: true }],
      TARGET_SCHEMA_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      TARGET_TABLE_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      EMAIL_ALERTS: ['Y', Validators.required],
      EMAIL_GROUP: ['', Validators.required],
      TABLE_SOURCE: ['', Validators.required],
      LOAD_STRATEGY: ['', Validators.required],
      FACT_SCHEMA_NAME: [''],
      FACT_TABLE_NAME: [''],
      FACT_ENV_NAME: [''],
      RAW_FACTORY_PATH: [''],
      RAW_FACTORY_MAX_LANDING_DATE: [null],
      RAW_FACTORY_RETENTION_STRATEGY: ['GLACIER'],
      RAW_FACTORY_RETENTION_DAYS: [180],
      RAW_FACTORY_SYNC_STATUS: ['TODO'],
      DB_ID: [''],
      DB_SCHEMA: [''],
      DB_TABLE: [''],
      DB_TABLE_PK_COLUMNS: [''],
      DB_TABLE_UPDATE_DATE_COLUMN: [''],
      CHECK_INDEX_EXIST: ['1'],
      T1_PATH: [''],
      T1_RETENTION_STRATEGY: ['GLACIER'],
      T1_RETENTION_DAYS: [180, Validators.compose([Validators.min(1), Validators.max(10000)])],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      ETL_STATUS: [''],
      ETL_STATUS_REASON: [''],
      ETL_DAG_NAME: [{ value: '', disabled: true }],
      ETL_DAG_RUN_ID: [{ value: '', disabled: true }],
      ETL_DAG_RUN_URL: [{ value: '', disabled: true }],
      ETL_PROCESS_START_DATE: [{ value: null, disabled: true }],
      ETL_PROCESS_END_DATE: [{ value: null, disabled: true }],
      ETL_EXECUTION_STATUS: [{ value: '', disabled: true }],
      ETL_PROCESS: [{ value: '', disabled: true }],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: [1, Validators.required],
      T1_MAX_LOAD_END_DATE: [null],
      T1_CLUSTER_ID: ['', Validators.required],
      T1_SPARK_CONFIG_ID: ['', Validators.required],
      T1_LIVY_BATCH_ID: [{ value: '', disabled: true }],
      T1_SPARK_APP_ID: [{ value: '', disabled: true }],
      T1_SPARK_UI_URL: [{ value: '', disabled: true }],
      T1_SPARK_LOG_URL: [{ value: '', disabled: true }],
      T1_PROCESS_START_DATE: [{ value: null, disabled: true }],
      T1_PROCESS_END_DATE: [{ value: null, disabled: true }],
      T1_EXECUTION_STATUS: [{ value: '', disabled: true }],
      T1_ERROR: [{ value: '', disabled: true }],
      T1_ERROR_TRACE: [{ value: '', disabled: true }],
      T1_S3_CLEANUP_STATUS: ['TODO'],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [1000, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
      T2_INSERT_BATCH_FILE_SIZE_GB: [1000, Validators.compose([Validators.required, Validators.min(1), Validators.max(10000)])],
      T2_PARTITION_JOB_TYPE: ['', Validators.required],
      T2_MAX_LOAD_END_DATE: [null, Validators.required],
      T2_MAX_ATLAS_VERSION: [{ value: 0, disabled: true }],
      T2_CLUSTER_ID: ['', Validators.required],
      T2_SPARK_CONFIG_ID: ['', Validators.required],
      T2_LIVY_BATCH_ID: [{ value: '', disabled: true }],
      T2_SPARK_APP_ID: [{ value: '', disabled: true }],
      T2_SPARK_UI_URL: [{ value: '', disabled: true }],
      T2_SPARK_LOG_URL: [{ value: '', disabled: true }],
      T2_PROCESS_START_DATE: [{ value: null, disabled: true }],
      T2_PROCESS_END_DATE: [{ value: null, disabled: true }],
      T2_EXECUTION_STATUS: [{ value: '', disabled: true }],
      T2_ERROR: [{ value: '', disabled: true }],
      T2_ERROR_TRACE: [{ value: '', disabled: true }],
      T2_S3_CLEANUP_STATUS: ['TODO'],
      T1_BROADCAST: ['1', Validators.required],
      ANALYZE_STATUS: ['TODO'],
      ANALYZE_EXECUTION_DAYS: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(30)])],
      ANALYZE_LAST_SUCCESS_DATE: [new Date()],
      ANALYZE_PROCESS_START_DATE: [{ value: null, disabled: true }],
      ANALYZE_PROCESS_END_DATE: [{ value: null, disabled: true }],
      ANALYZE_EXECUTION_STATUS: [{ value: null, disabled: true }],
      ANALYZE_ERROR: [{ value: '', disabled: true }],
      ANALYZE_ERROR_TRACE: [{ value: '', disabled: true }],
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editLoadControlForm.controls; }

  getEmails() {
    this.loadControlService.getEmails().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.emails = data.data;
        if (!this.editLoadControlForm.controls.EMAIL_GROUP.value) {
          this.editLoadControlForm.controls.EMAIL_GROUP.patchValue(this.emails[0].EMAIL_GROUP);
        }
      }
    });
  }

  getTableData() {
    const request = {
      query: `SCHEMA_NAME = '${this.record.SCHEMA_NAME}'
    AND TABLE_NAME = '${this.record.TABLE_NAME}' AND ENV_NAME = '${this.record.ENV_NAME}'`
    };
    this.loadControlService.getSearchQueryResult(request).subscribe((resp: any) => {
      this.tableInfo = resp.data[0];
    });
  }

  getFactTablesData() {
    this.loadControlService.getRecords().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        const factSchemaNames = data.data;
        this.factSchemaNamesBackup = factSchemaNames.filter(i => i.LOAD_STRATEGY === 'INSERT' || i.LOAD_STRATEGY === 'UPDATE');
        this.factENVSelected();
        this.factSchemaSelected();
      }
    }, error => {
      this.showToast('error', 'Fact Table data Load Failed.');
    });
  }

  factENVSelected() {
    const factSchemas = this.factSchemaNamesBackup.filter(i => i.ENV_NAME === this.editLoadControlForm.value.FACT_ENV_NAME);
    this.factSchemaNames = this.removeDuplicates(factSchemas, 'SCHEMA_NAME');
  }

  factSchemaSelected() {
    const factTables = this.factSchemaNamesBackup.filter(i =>
      i.SCHEMA_NAME === this.editLoadControlForm.value.FACT_SCHEMA_NAME
      && i.ENV_NAME === this.editLoadControlForm.value.FACT_ENV_NAME
    );
    this.factTablesNames = this.removeDuplicates(factTables, 'TABLE_NAME');
    this.editLoadControlForm.controls.FACT_TABLE_NAME.patchValue('');
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  loadStrategyUpdated() {
    if (this.record.LOAD_STRATEGY !== this.editLoadControlForm.value.LOAD_STRATEGY) {
      this.confirmationService.confirm({
        header: 'Confirmation for LOAD STRATEGY Change',
        // tslint:disable-next-line:max-line-length
        message: `<span class="mb-1 d-inline-block"><b>Are you sure you want to change LOAD STRATEGY?</b></span><ul><li>Changes will be saved in browser, it will be parmantly saved when you click 'SAVE'. <li>When you change LOAD STRATEGY, table will be put on HOLD & DAG will be generated with new LOAD STRATEGY. <li>You will have to verify TABLE SOURCE, T1, T2 & CMV details before changing ETL_STATUS from HOLD to TODO.</ul>`,
        accept: () => {
          this.editLoadControlForm.controls.ETL_STATUS.patchValue('HOLD');
          this.editLoadControlForm.controls.ETL_STATUS.disable();
          this.editLoadControlForm.controls.ETL_STATUS_REASON.disable();
          // tslint:disable-next-line:max-line-length
          this.editLoadControlForm.controls.ETL_STATUS_REASON.patchValue(`LOAD_STRATEGY is changed from ${this.record.LOAD_STRATEGY} to ${this.editLoadControlForm.value.LOAD_STRATEGY}`);
        },
        reject: () => {
          this.editLoadControlForm.controls.LOAD_STRATEGY.patchValue(this.record.LOAD_STRATEGY);
        }
      });
    } else {
      this.editLoadControlForm.controls.ETL_STATUS.enable();
      this.editLoadControlForm.controls.ETL_STATUS.patchValue(this.record.ETL_STATUS);
      this.editLoadControlForm.controls.ETL_STATUS_REASON.patchValue(this.record.ETL_STATUS_REASON);
    }
  }

  setLoadStrategyValidators() {
    const TABLE_SOURCE = this.editLoadControlForm.get('TABLE_SOURCE');
    const T1_STATUS = this.editLoadControlForm.get('T1_STATUS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.editLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const DB_TABLE_PK_COLUMNS = this.editLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const CHECK_INDEX_EXIST = this.editLoadControlForm.get('CHECK_INDEX_EXIST');
    const T1_MAX_LOAD_END_DATE = this.editLoadControlForm.get('T1_MAX_LOAD_END_DATE');
    const T1_CLUSTER_ID = this.editLoadControlForm.get('T1_CLUSTER_ID');
    const T2_INSERT_DIR_BATCH_SIZE = this.editLoadControlForm.get('T2_INSERT_DIR_BATCH_SIZE');
    const T2_INSERT_BATCH_FILE_SIZE_GB = this.editLoadControlForm.get('T2_INSERT_BATCH_FILE_SIZE_GB');
    const T1_BATCH_IN_DAYS = this.editLoadControlForm.get('T1_BATCH_IN_DAYS');
    const T1_SPARK_CONFIG_ID = this.editLoadControlForm.get('T1_SPARK_CONFIG_ID');
    const DB_ID = this.editLoadControlForm.get('DB_ID');
    const DB_SCHEMA = this.editLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.editLoadControlForm.get('DB_TABLE');
    const FACT_ENV_NAME = this.editLoadControlForm.get('FACT_ENV_NAME');
    const FACT_SCHEMA_NAME = this.editLoadControlForm.get('FACT_SCHEMA_NAME');
    const FACT_TABLE_NAME = this.editLoadControlForm.get('FACT_TABLE_NAME');

    this.editLoadControlForm.get('LOAD_STRATEGY').valueChanges
      .subscribe(LOAD_STRATEGY => {

        // Default
        DB_ID.enable();
        DB_SCHEMA.enable();
        DB_TABLE.enable();
        DB_TABLE_PK_COLUMNS.enable();
        DB_TABLE_UPDATE_DATE_COLUMN.enable();
        T2_INSERT_BATCH_FILE_SIZE_GB.enable();
        T2_INSERT_DIR_BATCH_SIZE.enable();
        CHECK_INDEX_EXIST.enable();
        TABLE_SOURCE.setValue('ORACLE');
        FACT_ENV_NAME.patchValue('');
        FACT_SCHEMA_NAME.patchValue('');
        FACT_TABLE_NAME.patchValue('');
        FACT_ENV_NAME.setValidators(null);
        FACT_SCHEMA_NAME.setValidators(null);
        FACT_TABLE_NAME.setValidators(null);
        T1_MAX_LOAD_END_DATE.setValidators(null);

        if (LOAD_STRATEGY === 'UPDATE') {
          T2_INSERT_BATCH_FILE_SIZE_GB.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
        } else if (LOAD_STRATEGY === 'INSERT') {
          T2_INSERT_BATCH_FILE_SIZE_GB.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
        } else if (LOAD_STRATEGY === 'SAMPLED') {
          TABLE_SOURCE.setValue('RAW_FACTORY');
          T1_STATUS.setValue('HOLD');
          T2_INSERT_DIR_BATCH_SIZE.disable();
          T1_BATCH_IN_DAYS.setValidators(null);
          T1_CLUSTER_ID.setValidators(null);
          T1_SPARK_CONFIG_ID.setValidators(null);
          T1_MAX_LOAD_END_DATE.setValidators(null);
        } else if (LOAD_STRATEGY === 'FLAT') {
          TABLE_SOURCE.patchValue('');
          DB_ID.disable();
          CHECK_INDEX_EXIST.disable();
          DB_SCHEMA.disable();
          DB_TABLE.disable();
          DB_TABLE_PK_COLUMNS.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();
          T1_STATUS.setValue('HOLD');
          TABLE_SOURCE.setValidators(null);
          T1_MAX_LOAD_END_DATE.setValidators(null);
          T1_BATCH_IN_DAYS.setValidators(null);
          T1_CLUSTER_ID.setValidators(null);
          T1_SPARK_CONFIG_ID.setValidators(null);
          FACT_ENV_NAME.setValidators([Validators.required]);
          FACT_SCHEMA_NAME.setValidators([Validators.required]);
          FACT_TABLE_NAME.setValidators([Validators.required]);
        } else if (LOAD_STRATEGY === 'REFRESH') {
          DB_TABLE_PK_COLUMNS.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();
          CHECK_INDEX_EXIST.disable();
          T1_MAX_LOAD_END_DATE.setValidators([Validators.required]);
        } else {
          TABLE_SOURCE.setValue('ORACLE');
        }
        T1_BATCH_IN_DAYS.updateValueAndValidity();
        T1_MAX_LOAD_END_DATE.updateValueAndValidity();
        T1_CLUSTER_ID.updateValueAndValidity();
        T1_SPARK_CONFIG_ID.updateValueAndValidity();
        TABLE_SOURCE.updateValueAndValidity();
        FACT_ENV_NAME.updateValueAndValidity();
        FACT_SCHEMA_NAME.updateValueAndValidity();
        FACT_TABLE_NAME.updateValueAndValidity();
      });
  }

  etlStatusChanged() {
    if (this.editLoadControlForm.value.ETL_STATUS !== 'HOLD') {
      this.editLoadControlForm.controls.ETL_STATUS_REASON.patchValue('');
      this.editLoadControlForm.controls.ETL_STATUS_REASON.setValidators(null);
      this.editLoadControlForm.controls.ETL_STATUS_REASON.updateValueAndValidity();
    } else {
      this.editLoadControlForm.controls.ETL_STATUS_REASON.setValidators([Validators.required]);
      this.editLoadControlForm.controls.ETL_STATUS_REASON.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.editLoadControlForm.invalid) {
      return;
    }

    const formValues = Object.assign({}, this.editLoadControlForm.getRawValue());
    formValues.UPDATE_DATE = new Date();
    // tslint:disable-next-line:forin
    for (const key in formValues) {
      const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
      const dataType = this.recordMeta[index] && this.recordMeta[index].DATA_TYPE;
      if (formValues[key]) {
        if (dataType === 'timestamp') {
          formValues[key] = `${moment(formValues[key]).format(
            'YYYY-MM-DD HH:mm:ss'
            )}`;
        }
      }
    }

    formValues.SCHEMA_NAME = this.record.SCHEMA_NAME;
    formValues.TABLE_NAME = this.record.TABLE_NAME;
    formValues.ENV_NAME = this.record.ENV_NAME;
    formValues.CHECK_INDEX_EXIST = formValues.CHECK_INDEX_EXIST === '1' ? true : false;
    formValues.T1_BROADCAST = formValues.T1_BROADCAST === '1' ? true : false;

    const body = {
      record: formValues
    };
    this.loadControlService.updateRecord(body).subscribe((data: any) => {
      setTimeout(() => {
        this.showToast('success', 'record updated.');
      });
      this.router.navigate(['/loadcontrol']);
    }, error => {
      this.showToast('error', 'Could not update record.');
    });
    if (
      this.record.LOAD_STRATEGY !== this.editLoadControlForm.value.LOAD_STRATEGY
      || this.record.EMAIL_GROUP !== this.editLoadControlForm.value.EMAIL_GROUP
      || this.record.EMAIL_ALERTS !== this.editLoadControlForm.value.EMAIL_ALERTS
    ) {
      const request = { records: [formValues] };
      request.records[0].SCHEMA_NAME = this.record.SCHEMA_NAME;
      request.records[0].SCHEMA_NAME = this.record.SCHEMA_NAME;
      request.records[0].TABLE_NAME = this.record.TABLE_NAME;
      request.records[0].DAG_SCHEDULE_INTERVAL = this.tableInfo.DAG_SCHEDULE_INTERVAL;
      request.records[0].DAG_AVAILABLE_STATUS = 'TODO';
      this.loadControlService.setSchedulerInterval(request).subscribe((data: any) => {
        if (!data.error) {
          setTimeout(() => {
            this.showToast('success', 'Dag Scheduled!');
          }, 500);
        }
      }, error => {
        this.showToast('error', 'Dag Schedule failed.');
      });
    }
  }

  getColumnDataTypeAndSetFormValues() {
    this.loadControlService.getColumnDataType().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordMeta = data.data;
        const formControls = this.editLoadControlForm.controls;
        for (const key in formControls) {
          const element = formControls[key];
          const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
          const dataType = this.recordMeta[index].DATA_TYPE;
          if (this.record[key]) {
            if (dataType == "timestamp") {
              element.patchValue(new Date(this.record[key]));
            }
            else if (dataType == "bit") {
              if (this.record[key] && this.record[key].data && this.record[key].data[0] || this.record[key] === 1 ||
                this.record[key] === true) {
                element.patchValue('1');
              }
              else {
                element.patchValue('0');
              }
            }
            else {
              element.patchValue(this.record[key]);
            }
          }
        }
        this.getUserInfo();
        this.checkForLinks();
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  checkForLinks() {
    const cols = document.querySelectorAll('input');
    cols.forEach((item) => {
      // tslint:disable-next-line:one-variable-per-declaration
      const value = item.value,
        linkRegex1 = 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)',
        linkRegex2 = '[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)',
        linkRegex3 = 'https|http';
      if (value.match(linkRegex1) || value.match(linkRegex2) || value.match(linkRegex3)) {
        item.classList.add('linkInput');
        const parent = item.parentNode;
        if (parent.lastChild === item) {
          const div = document.createElement('span');
          const htmlString = `<a class="ext-link" href="${value}" target="_blank">
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                              </a>`;
          div.innerHTML = htmlString.trim();
          parent.appendChild(div);
        }
      }
    });
  }

  setTableSourceValidators() {
    const DB_ID = this.editLoadControlForm.get('DB_ID');
    const LOAD_STRATEGY = this.editLoadControlForm.get('LOAD_STRATEGY');
    const DB_SCHEMA = this.editLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.editLoadControlForm.get('DB_TABLE');
    const DB_TABLE_PK_COLUMNS_SCHEMA = this.editLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.editLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const CHECK_INDEX_EXIST = this.editLoadControlForm.get('CHECK_INDEX_EXIST');
    const RAW_FACTORY_PATH = this.editLoadControlForm.get('RAW_FACTORY_PATH');
    const RAW_FACTORY_RETENTION_STRATEGY = this.editLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY');
    const RAW_FACTORY_RETENTION_DAYS = this.editLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
    const RAW_FACTORY_MAX_LANDING_DATE = this.editLoadControlForm.get('RAW_FACTORY_MAX_LANDING_DATE');
    const RAW_FACTORY_SYNC_STATUS = this.editLoadControlForm.get('RAW_FACTORY_SYNC_STATUS');
    const EMAIL_GROUP = this.editLoadControlForm.get('EMAIL_GROUP');


    this.editLoadControlForm.get('TABLE_SOURCE').valueChanges
      .subscribe(TABLE_SOURCE => {

        if (TABLE_SOURCE === 'ORACLE') {

          DB_ID.setValidators([Validators.required]);
          DB_SCHEMA.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          DB_TABLE.setValidators([Validators.required, Validators.pattern(this.tableRegex)]);
          DB_TABLE_PK_COLUMNS_SCHEMA.setValidators([Validators.required, Validators.pattern(this.tableColumnRegex)]);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators([Validators.required, Validators.pattern(this.tableColumnRegex)]);
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
          RAW_FACTORY_SYNC_STATUS.disable();
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
          RAW_FACTORY_MAX_LANDING_DATE.setValidators([Validators.required]);
          RAW_FACTORY_PATH.enable();
          RAW_FACTORY_RETENTION_STRATEGY.enable();
          RAW_FACTORY_RETENTION_DAYS.enable();
          RAW_FACTORY_MAX_LANDING_DATE.enable();
          RAW_FACTORY_SYNC_STATUS.enable();
        }

        if (LOAD_STRATEGY.value === 'REFRESH') {
          DB_TABLE_PK_COLUMNS_SCHEMA.setValidators(null);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators(null);
          CHECK_INDEX_EXIST.setValidators(null);
          DB_TABLE_PK_COLUMNS_SCHEMA.disable();
          DB_TABLE_UPDATE_DATE_COLUMN.disable();
          CHECK_INDEX_EXIST.disable();
        }

        DB_ID.updateValueAndValidity();
        DB_SCHEMA.updateValueAndValidity();
        DB_TABLE.updateValueAndValidity();
        DB_TABLE_PK_COLUMNS_SCHEMA.updateValueAndValidity();
        DB_TABLE_UPDATE_DATE_COLUMN.updateValueAndValidity();
        CHECK_INDEX_EXIST.updateValueAndValidity();
        RAW_FACTORY_PATH.updateValueAndValidity();
        RAW_FACTORY_MAX_LANDING_DATE.updateValueAndValidity();
      });

    this.editLoadControlForm.get('EMAIL_ALERTS').valueChanges
      .subscribe(EMAIL_ALERTS => {
        if (EMAIL_ALERTS === 'Y') {
          EMAIL_GROUP.setValidators([Validators.required]);
          EMAIL_GROUP.enable();
        } else {
          EMAIL_GROUP.setValidators(null);
          EMAIL_GROUP.disable();
        }
        EMAIL_GROUP.updateValueAndValidity();
      });
  }

  setRetentionStrategyValidators() {
    this.editLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY').valueChanges
      .subscribe(RAW_FACTORY_RETENTION_STRATEGY => {
        const RAW_FACTORY_RETENTION_DAYS = this.editLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
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

    this.editLoadControlForm.get('T1_RETENTION_STRATEGY').valueChanges
      .subscribe(T1_RETENTION_STRATEGY => {
        const T1_RETENTION_DAYS = this.editLoadControlForm.get('T1_RETENTION_DAYS');
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

    this.editLoadControlForm.get('T2_T3_RETENTION_STRATEGY').valueChanges
      .subscribe(T2_T3_RETENTION_STRATEGY => {
        const T2_T3_RETENTION_DAYS = this.editLoadControlForm.get('T2_T3_RETENTION_DAYS');
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

  getSparkConfig() {
    this.sparkConfigService.getSparkConfig().subscribe((resp: any) => {
      this.sparkConfigId = resp.data;
    });
  }

  autoGenerateS3Url(type) {
    if (type === "RAW_FACTORY_PATH") {
      const TABLE_NAME = this.editLoadControlForm.get('TABLE_NAME');
      const RAW_FACTORY_PATH = this.editLoadControlForm.get('RAW_FACTORY_PATH');
      let TABLE_NAMEString = TABLE_NAME.value.trim();
      if (undefined != TABLE_NAMEString && null != TABLE_NAMEString && TABLE_NAMEString != "") {
        if (TABLE_NAMEString.lastIndexOf("_FACT") > 0) {
          TABLE_NAMEString = (TABLE_NAMEString.substring(0, TABLE_NAMEString.lastIndexOf("_FACT"))).toLowerCase();
        }
        else {
          TABLE_NAMEString = TABLE_NAMEString.toLowerCase();
        }
        const url = `s3://${environment.RAW_FACTORY_PATH_DEFAULT_SETTING}/${TABLE_NAMEString.toUpperCase()}/t0/`;
        RAW_FACTORY_PATH.setValue(url);
      }
      else {
        this.showToast('error', 'Please provide TABLE_NAME');
      }
    }
    else if (type === "T1_PATH") {
      //<T1_PATH_DEFAULT_SETTING>/lowercase(<schema>.db_<table_name>)/
      const TABLE_NAME = this.editLoadControlForm.get('TABLE_NAME');
      const TABLE_NAMEString = TABLE_NAME.value.trim();
      const SCHEMA_NAME = this.editLoadControlForm.get('SCHEMA_NAME');
      const SCHEMA_NAMEString = SCHEMA_NAME.value.trim();
      const T1_PATH = this.editLoadControlForm.get('T1_PATH');

      if (undefined != TABLE_NAMEString && null != TABLE_NAMEString && TABLE_NAMEString != "" &&
        undefined != SCHEMA_NAMEString && null != SCHEMA_NAMEString && SCHEMA_NAMEString != "") {
        const urlString = (`${SCHEMA_NAMEString}.db_${TABLE_NAMEString}`).toLowerCase();
        const url = `s3://${environment.T1_PATH_DEFAULT_SETTING}/${urlString}/`;
        T1_PATH.setValue(url);
      }
      else {
        this.showToast('error', 'Please provide TABLE_NAME and SCHEMA_NAME');
      }
    }
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}