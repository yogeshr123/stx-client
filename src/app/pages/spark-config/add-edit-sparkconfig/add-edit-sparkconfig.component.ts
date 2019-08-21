import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SparkConfigService } from 'src/app/services/spark-config.service';
import { LoadControlService } from 'src/app/services/load-control.service';
import * as _lodash from 'lodash';
import { remove, find } from 'lodash';
import { SparkConfigPropertiesService } from 'src/app/services/spark-config-properties.service';

class SparkConfig {
  CONFIG_KEY: string;
  DATA_TYPE: string;
  REGEX: string;
  VALUE_SET: string;
  EXAMPLE: string;
  VALUE: string

  clear(): void {
    this.CONFIG_KEY = '';
    this.DATA_TYPE = '';
    this.REGEX = '';
    this.VALUE_SET = '';
    this.EXAMPLE = '';
    this.VALUE = '';
  }
}

@Component({
  selector: 'app-add-edit-sparkconfig',
  templateUrl: './add-edit-sparkconfig.component.html',
  styleUrls: ['./add-edit-sparkconfig.component.scss']
})
export class AddEditSparkconfigComponent implements OnInit {

  addEditForm: FormGroup;
  selectedSparkConfig: any;
  submitted: boolean = false;
  isNew: boolean = true;
  routeInfo = {
    path: '',
    isViewOnly: false,
    isEditMode: false
  };
  loader = {
    formData: false,
    saveSparkConfig: false
  };
  appState: any;
  schemaNames: any;
  tableNames: any;
  sparkConfigProperties = [];
  sparkConfigArray = [];
  sparkConfig: SparkConfig;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sparkConfigService: SparkConfigService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private loadControlService: LoadControlService,
    private sparkConfigPropertiesService: SparkConfigPropertiesService
  ) {
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
    this.appState = JSON.parse(localStorage.getItem('appState'));
    this.formInit();
    if (this.routeInfo.isEditMode) {
      this.setFormValues();
    }
    this.getUserInfo();
    this.loadSchemaNames();
    this.loadTableNames();
    this.loadSparkServiceProperties();
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      SCHEMA_NAME: ['', Validators.required],
      TABLE_NAME: ['', Validators.required],
      ENV_NAME: ['', Validators.required],
      LOAD_TYPE: ['', Validators.required],
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['', Validators.required],
    });
  }

  addItem() {
    this.sparkConfig = new SparkConfig();
    this.sparkConfigArray.push(this.sparkConfig);
  }

  onSparkConfigKeySelected(value, index) {
    let tempConf = remove(this.sparkConfigProperties, (item: any) => item.CONFIG_KEY === value);
    if (tempConf.length > 0)
      this.sparkConfigArray[index] = tempConf[0];
  }

  removeItem(index: number, key: string) {
    const tempConf = this.sparkConfigArray.splice(index, 1);
    if (tempConf.length > 0)
      this.sparkConfigProperties.push(tempConf[0]);
  }

  getUserInfo() {
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      this.addEditForm.controls.UPDATED_BY.patchValue(this.appState.loggedInUser.USER_NAME);
    }
  }

  setFormValues() {
    if (this.appState && this.appState.selectedSparkConfig) {
      this.selectedSparkConfig = this.appState.selectedSparkConfig;
      const formControls = this.addEditForm.controls;
      if (this.selectedSparkConfig) {
        for (const key in formControls) {
          if (formControls.hasOwnProperty(key)) {
            const element = formControls[key];
            element.patchValue(this.selectedSparkConfig[key]);
          }
        }
      }
    }
  }

  get f() {
    return this.addEditForm.controls;
  }


  submit() {
    let sparkConfigList = {};
    this.sparkConfigArray.forEach(childObj => {
      sparkConfigList[childObj.CONFIG_KEY] = childObj.VALUE;
    })
    this.submitted = true;
    // stop here if form is invalid
    if (this.addEditForm.invalid) {
      return;
    }
    if (!this.sparkConfigArray.length) {
      this.showToast('info', 'Please select spark configurations.');
      return;
    }
    this.loader.saveSparkConfig = true;
    let formValues = Object.assign({}, this.addEditForm.value);
    formValues.UPDATE_DATE = `${new Date()}`;
    formValues.SPARK_CONF = sparkConfigList;
    let body = {
      record: formValues,
    };
    let functionToCall = 'addSparkConfig';
    if (this.routeInfo.isEditMode) {
      functionToCall = 'updateSparkConfig';
    }

    // if (this.routeInfo.isEditMode) {
    this.sparkConfigService[functionToCall](body).subscribe((data: any) => {
      if (data && !data.error) {
        this.showToast('success', 'Successfully Saved.');
        this.router.navigate(['/spark-config']);
      } else {
        this.showToast('error', 'Could not save data.');
      }
      this.loader.saveSparkConfig = false;
    }, error => {
      this.showToast('error', 'Could not save data.');
      this.loader.saveSparkConfig = false;
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  loadSchemaNames() {
    this.loadControlService.getDistinctSchemaNames().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.schemaNames = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  loadTableNames() {
    this.loadControlService.getDistinctTableNames().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.tableNames = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  loadSparkServiceProperties() {
    this.sparkConfigPropertiesService.getSparkConfigProperties().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.sparkConfigProperties = data.data;;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }
}
