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
    this.getColumnDataType();
    this.getUserInfo();
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
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      ENV_NAME: ['', Validators.required],
      TARGET_SCHEMA_NAME: ['', Validators.required],
      TARGET_TABLE_NAME: ['', Validators.required],
      EMAIL_ALERTS: ['', Validators.required],
      TABLE_SOURCE: ['', Validators.required],
      LOAD_STRATEGY: ['', Validators.required],
      RAW_FACTORY_PATH: ['', Validators.pattern(this.s3UrlPattern)],
      RAW_FACTORY_MAX_LANDING_DATE: [null],
      RAW_FACTORY_RETENTION_STRATEGY: [''],
      RAW_FACTORY_RETENTION_DAYS: [0],
      DB_ID: [''],
      DB_SCHEMA: [''],
      DB_TABLE: [''],
      DB_TABLE_PK_COLUMNS: [''],
      DB_TABLE_UPDATE_DATE_COLUMN: [''],
      CHECK_INDEX_EXIST: ['TRUE'],
      ETL_STATUS: [''],
      ETL_STATUS_REASON: [''],
      ETL_EXECUTION_STATUS: ['TODO'],
      T1_PATH: ['', Validators.pattern(this.s3UrlPattern)],
      T1_RETENTION_STRATEGY: [''],
      T1_RETENTION_DAYS: [0],
      T1_STATUS: [''],
      T1_BATCH_IN_DAYS: ['', Validators.required],
      T1_MAX_LOAD_END_DATE: [null],
      T1_CLUSTER_ID: ['', Validators.required],
      T1_EXECUTION_STATUS: ['TODO'],
      T2_T3_RETENTION_STRATEGY: [''],
      T2_T3_RETENTION_DAYS: [0],
      T2_STATUS: [''],
      T2_INSERT_DIR_BATCH_SIZE: [0, Validators.required],
      T2_PARTITION_JOB_TYPE: ['SINGLE', Validators.required],
      T2_MAX_LOAD_END_DATE: [null],
      T2_CLUSTER_ID: ['', Validators.required],
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
    const CHECK_INDEX_EXIST = this.addLoadControlForm.get('CHECK_INDEX_EXIST');
    const RAW_FACTORY_PATH = this.addLoadControlForm.get('RAW_FACTORY_PATH');
    const RAW_FACTORY_RETENTION_STRATEGY = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_STRATEGY');
    const RAW_FACTORY_RETENTION_DAYS = this.addLoadControlForm.get('RAW_FACTORY_RETENTION_DAYS');
    const RAW_FACTORY_MAX_LANDING_DATE = this.addLoadControlForm.get('RAW_FACTORY_MAX_LANDING_DATE');

    this.addLoadControlForm.get('TABLE_SOURCE').valueChanges
      .subscribe(TABLE_SOURCE => {

        if (TABLE_SOURCE === 'ORACLE') {
          DB_ID.setValidators([Validators.required]);
          DB_SCHEMA.setValidators([Validators.required]);
          DB_TABLE.setValidators([Validators.required]);
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators([Validators.required]);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators([Validators.required]);
          CHECK_INDEX_EXIST.setValidators([Validators.required]);

          DB_ID.enable();
          DB_SCHEMA.enable();
          DB_TABLE.enable();
          DBDB_TABLE_PK_COLUMNS_SCHEMA.enable();
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
          DBDB_TABLE_PK_COLUMNS_SCHEMA.setValidators(null);
          DB_TABLE_UPDATE_DATE_COLUMN.setValidators(null);
          CHECK_INDEX_EXIST.setValidators(null);

          DB_ID.disable();
          DB_SCHEMA.disable();
          DB_TABLE.disable();
          DBDB_TABLE_PK_COLUMNS_SCHEMA.disable();
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
