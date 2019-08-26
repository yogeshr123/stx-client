import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SparkConfigService } from 'src/app/services/spark-config.service';
import { LoadControlService } from 'src/app/services/load-control.service';
import * as _lodash from 'lodash';
import { remove, findIndex, forEach } from 'lodash';
import { SparkConfigPropertiesService } from 'src/app/services/spark-config-properties.service';
import { CommonService } from 'src/app/services/common.service';

class SparkConfig {
  CONFIG_KEY: string;
  DATA_TYPE: string;
  REGEX: string;
  VALUE_SET: string;
  EXAMPLE: string;
  VALUE: string

  constructor() {
    this.CONFIG_KEY = '';
    this.DATA_TYPE = '';
    this.REGEX = '';
    this.VALUE_SET = '';
    this.EXAMPLE = '';
    this.VALUE = '';
  }
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
  private sparkConfigList: FormArray;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sparkConfigService: SparkConfigService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private loadControlService: LoadControlService,
    private sparkConfigPropertiesService: SparkConfigPropertiesService,
    private commonService:CommonService
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

  async ngOnInit() {
    this.appState = this.commonService.getState();
    this.formInit();
    this.loadSparkConfigProperties();
    this.getUserInfo();
  }

  ngOnDestroy() {
    delete this.appState.selectedSparkConfig;
    this.commonService.setState(this.appState);
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      SCHEMA_NAME: [{ value: '', disabled: true }, Validators.required],
      TABLE_NAME: [{ value: '', disabled: true }, Validators.required],
      ENV_NAME: ['', Validators.required],
      LOAD_TYPE: ['', Validators.required],
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['', Validators.required],
      SPARK_CONF: this.formBuilder.array([])
    });
    this.sparkConfigList = this.addEditForm.get('SPARK_CONF') as FormArray;
  }

  loadData(value, type) {
    if (type === "ENV_NAME") {
      this.loadSchemaNames(value);
      this.addEditForm.get('SCHEMA_NAME').enable();
    }
    else if (type === "SCHEMA_NAME") {
      if (value !== "*") {
        const ENV_NAME = this.addEditForm.get('ENV_NAME').value;
        this.addEditForm.get('TABLE_NAME').enable();
        this.loadTableNames(ENV_NAME, value);
      }
      else {
        this.addEditForm.get('TABLE_NAME').disable();
        this.addEditForm.get('TABLE_NAME').patchValue("*")
      }
    }
  }

  get SparkConfigFormGroup() {
    return this.addEditForm.get('SPARK_CONF') as FormArray;
  }

  getSparkConfigFormGroup(index): FormGroup {
    const formGroup = this.sparkConfigList.controls[index] as FormGroup;
    return formGroup;
  }

  createConf() {
    return this.formBuilder.group(new SparkConfig());
  }

  addItem() {
    this.sparkConfigList.push(this.createConf());
    // this.sparkConfigArray.push(new SparkConfig());
  }

  onSparkConfigKeySelected(value, index, controlValue) {
    let tempConf = remove(this.sparkConfigProperties, (item: any) => item.CONFIG_KEY === value);
    if (tempConf.length > 0) {
      tempConf = tempConf[0];
      this.sparkConfigArray[index] = tempConf;
      const formControls = this.getSparkConfigFormGroup(index).controls;
      for (const key in formControls) {
        if (formControls.hasOwnProperty(key)) {
          const element = formControls[key];
          element.patchValue(tempConf[key]);
          if (key === "CONFIG_KEY") {
            this.getSparkConfigFormGroup(index).controls['CONFIG_KEY'].disable();
          }
        }
      }
      if (controlValue) {
        this.getSparkConfigFormGroup(index).controls['VALUE'].patchValue(controlValue);
      }
      this.applyValidation(index, tempConf);
    }
    else {
      this.showToast('error', `${value} not found in spark configuration properties`);
    }
  }

  applyValidation(index, tempConf) {
    let validators = null;
    Validators.min(1)
    if (tempConf['DATA_TYPE'] === 'RANGE' && tempConf['VALUE_SET']) {
      const min = tempConf['VALUE_SET'].split('-')[0];
      const max = tempConf['VALUE_SET'].split('-')[1];
      validators = Validators.compose([
        Validators.required,
        Validators.min(min),
        Validators.max(max)
      ]);
    }
    else if (tempConf['REGEX']) {
      validators = Validators.compose([
        Validators.required,
        Validators.pattern(tempConf['REGEX'])
        // Validators.pattern("([0-9]+(|.[0-9]+)(m|g|k)$)")
      ]);
    }
    else {
      validators = Validators.compose([
        Validators.required
      ]);
    }
    this.getSparkConfigFormGroup(index).controls['VALUE'].setValidators(
      validators
    );

    this.getSparkConfigFormGroup(index).controls['VALUE'].updateValueAndValidity();
  }

  removeItem(index: number, key: string) {
    const tempConf = this.sparkConfigArray.splice(index, 1);
    if (tempConf.length > 0 && key)
      this.sparkConfigProperties.push(tempConf[0]);
    this.sparkConfigList.removeAt(index);
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
            if (key === "SPARK_CONF") {
              console.log(this.selectedSparkConfig[key]);
              let sparkConfig = JSON.parse(this.selectedSparkConfig[key]);
              let index = 0;
              for (var config in sparkConfig) {
                this.addItem();
                console.log(sparkConfig[config] + config);
                this.onSparkConfigKeySelected(config, index, sparkConfig[config]);
                index++;
              }
            }
            else {
              element.patchValue(this.selectedSparkConfig[key]);
              element.disable();
            }
          }
        }
      }
    }
  }

  get f() {
    return this.addEditForm.controls;
  }


  submit() {
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
    let formValues = Object.assign({}, this.addEditForm.getRawValue());
    formValues.UPDATE_DATE = `${new Date()}`;

    let sparkConfig = {};
    formValues.SPARK_CONF.forEach(childObj => {
      if (childObj.CONFIG_KEY && childObj.VALUE) {
        sparkConfig[childObj.CONFIG_KEY] = childObj.VALUE;
      }
    });
    formValues.SPARK_CONF = sparkConfig;

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
      if (error.error.error.code === "ER_DUP_ENTRY") {
        this.showToast('error', 'Record already exists.');
      }

      this.loader.saveSparkConfig = false;
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  loadSchemaNames(ENV_NAME: string) {
    this.loadControlService.getDistinctSchemaNames(ENV_NAME).subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.schemaNames = data.data;
      }
      else {
        this.schemaNames = [];
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  loadTableNames(ENV_NAME: string, SCHEMA_NAME: string) {
    this.loadControlService.getDistinctTableNames(ENV_NAME, SCHEMA_NAME).subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.tableNames = data.data;
      }
      else {
        this.tableNames = [];
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  loadSparkConfigProperties() {
    this.sparkConfigPropertiesService.getSparkConfigProperties().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.sparkConfigProperties = data.data;
        if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
          this.setFormValues();
        }
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }
}
