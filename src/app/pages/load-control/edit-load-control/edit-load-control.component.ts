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

@Component({
  selector: 'app-edit-load-control',
  templateUrl: './edit-load-control.component.html',
  styleUrls: ['./edit-load-control.component.css']
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
  isEdit = false;
  appState: any;
  tableRegex = "[A-Za-z][A-Za-z0-9_]*";
  factSchemaNamesBackup: any;
  factSchemaNames: any;
  factTablesNames: any;

  constructor(
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
    this.appState = this.commonService.getState();
    this.loadDBEndpoints();
    this.getClusters();
    this.formInit();
    this.setTableSourceValidators();
    this.setRetentionStrategyValidators();
    if (this.appState.selectedRecord && this.appState.selectedRecord.record) {
      this.record = this.appState.selectedRecord.record;
      this.isEdit = this.appState.selectedRecord.edit;
      this.getColumnDataTypeAndSetFormValues();
    }
    else {
      this.router.navigate(['/loadcontrol/add']);
    }
    this.getFactTablesData();
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
      ENV_NAME: [{ value: '', disabled: true }],
      TARGET_SCHEMA_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      TARGET_TABLE_NAME: ['', Validators.compose([Validators.required, Validators.pattern(this.tableRegex)])],
      EMAIL_ALERTS: ['Y', Validators.required],
      TABLE_SOURCE: ['', Validators.required],
      LOAD_STRATEGY: ['', Validators.required],
      FACT_SCHEMA_NAME: [''],
      FACT_TABLE_NAME: [''],
      FACT_ENV_NAME: [''],
      RAW_FACTORY_PATH: [''],
      RAW_FACTORY_MAX_LANDING_DATE: [null],
      RAW_FACTORY_RETENTION_STRATEGY: [''],
      RAW_FACTORY_RETENTION_DAYS: [0],
      DB_ID: [''],
      DB_SCHEMA: [''],
      DB_TABLE: [''],
      DB_TABLE_PK_COLUMNS: [''],
      DB_TABLE_UPDATE_DATE_COLUMN: [''],
      CHECK_INDEX_EXIST: ['1'],
      T1_PATH: [''],
      T1_RETENTION_STRATEGY: [''],
      T1_RETENTION_DAYS: [0],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      ETL_STATUS: [''],
      // ETL_STATUS_REASON: [''],
      ETL_DAG_NAME: [{ value: '', disabled: true }],
      ETL_DAG_RUN_ID: [{ value: '', disabled: true }],
      ETL_DAG_RUN_URL: [{ value: '', disabled: true }],
      ETL_PROCESS_START_DATE: [{ value: null, disabled: true }],
      ETL_PROCESS_END_DATE: [{ value: null, disabled: true }],
      ETL_EXECUTION_STATUS: [{ value: '', disabled: true }],
      ETL_PROCESS: [{ value: '', disabled: true }],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: [0, Validators.required],
      T1_MAX_LOAD_END_DATE: [null],
      T1_CLUSTER_ID: ['', Validators.required],
      T1_LIVY_BATCH_ID: [{ value: '', disabled: true }],
      T1_SPARK_APP_ID: [{ value: '', disabled: true }],
      T1_SPARK_UI_URL: [{ value: '', disabled: true }],
      T1_SPARK_LOG_URL: [{ value: '', disabled: true }],
      T1_PROCESS_START_DATE: [{ value: null, disabled: true }],
      T1_PROCESS_END_DATE: [{ value: null, disabled: true }],
      T1_EXECUTION_STATUS: [{ value: '', disabled: true }],
      T1_ERROR: [{ value: '', disabled: true }],
      T1_ERROR_TRACE: [{ value: '', disabled: true }],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [0, Validators.required],
      T2_PARTITION_JOB_TYPE: ['', Validators.required],
      T2_MAX_LOAD_END_DATE: [null, Validators.required],
      T2_MAX_ATLAS_VERSION: [{ value: 0, disabled: true }],
      T2_CLUSTER_ID: ['', Validators.required],
      T2_LIVY_BATCH_ID: [{ value: '', disabled: true }],
      T2_SPARK_APP_ID: [{ value: '', disabled: true }],
      T2_SPARK_UI_URL: [{ value: '', disabled: true }],
      T2_SPARK_LOG_URL: [{ value: '', disabled: true }],
      T2_PROCESS_START_DATE: [{ value: null, disabled: true }],
      T2_PROCESS_END_DATE: [{ value: null, disabled: true }],
      T2_EXECUTION_STATUS: [{ value: '', disabled: true }],
      T2_ERROR: [{ value: '', disabled: true }],
      T2_ERROR_TRACE: [{ value: '', disabled: true }],
      ANALYZE_STATUS: [''],
      ANALYZE_EXECUTION_DAYS: [1, Validators.required],
      ANALYZE_LAST_SUCCESS_DATE: [null],
      ANALYZE_PROCESS_START_DATE: [{ value: null, disabled: true }],
      ANALYZE_PROCESS_END_DATE: [{ value: null, disabled: true }],
      ANALYZE_EXECUTION_STATUS: [{ value: null, disabled: true }],
      ANALYZE_ERROR: [{ value: '', disabled: true }],
      ANALYZE_ERROR_TRACE: [{ value: '', disabled: true }],
      UPDATE_DATE: [{ value: null, disabled: true }, Validators.required],
      UPDATED_BY: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editLoadControlForm.controls; }

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
    const factTables = this.factSchemaNamesBackup.filter(i => i.SCHEMA_NAME === this.editLoadControlForm.value.FACT_SCHEMA_NAME);
    this.factTablesNames = this.removeDuplicates(factTables, 'TABLE_NAME');
  }

  loadStrategyUpdated() {
    const formControl = this.editLoadControlForm.controls;
    if (this.editLoadControlForm.value.LOAD_STRATEGY !== 'FLAT') {
      formControl.FACT_ENV_NAME.patchValue('');
      formControl.FACT_SCHEMA_NAME.patchValue('');
      formControl.FACT_TABLE_NAME.patchValue('');
    } else {
      formControl.FACT_ENV_NAME.setValidators([Validators.required]);
      formControl.FACT_ENV_NAME.updateValueAndValidity();
      formControl.FACT_SCHEMA_NAME.setValidators([Validators.required]);
      formControl.FACT_SCHEMA_NAME.updateValueAndValidity();
      formControl.FACT_TABLE_NAME.setValidators([Validators.required]);
      formControl.FACT_TABLE_NAME.updateValueAndValidity();
    }
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.editLoadControlForm.invalid) {
      return;
    }

    let formValues = Object.assign({}, this.editLoadControlForm.value);
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

    formValues.SCHEMA_NAME = this.record.SCHEMA_NAME;
    formValues.TABLE_NAME = this.record.TABLE_NAME;
    formValues.ENV_NAME = this.record.ENV_NAME;

    const body = {
      record: formValues
    };
    this.loadControlService.updateRecord(body).subscribe((data: any) => {
      this.showToast('success', 'record updated.');
      this.router.navigate(['/loadcontrol']);
    }, error => {
      this.showToast('error', 'Could not update record.');
    });
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
    const DB_SCHEMA = this.editLoadControlForm.get('DB_SCHEMA');
    const DB_TABLE = this.editLoadControlForm.get('DB_TABLE');
    const DB_TABLE_PK_COLUMNS_SCHEMA = this.editLoadControlForm.get('DB_TABLE_PK_COLUMNS');
    const DB_TABLE_UPDATE_DATE_COLUMN = this.editLoadControlForm.get('DB_TABLE_UPDATE_DATE_COLUMN');
    const CHECK_INDEX_EXIST = this.editLoadControlForm.get('CHECK_INDEX_EXIST');
    const RAW_FACTORY_PATH = this.editLoadControlForm.get('RAW_FACTORY_PATH');
    const RAW_FACTORY_RETENTION_STRATEGY = this.editLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY');
    const RAW_FACTORY_RETENTION_DAYS = this.editLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
    const RAW_FACTORY_MAX_LANDING_DATE = this.editLoadControlForm.get('RAW_FACTORY_MAX_LANDING_DATE');


    this.editLoadControlForm.get('TABLE_SOURCE').valueChanges
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
        CHECK_INDEX_EXIST.updateValueAndValidity();
        RAW_FACTORY_PATH.updateValueAndValidity();
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
        const url = `s3://${environment.RAW_FACTORY_PATH_DEFAULT_SETTING}/${TABLE_NAMEString}/t0/`;
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