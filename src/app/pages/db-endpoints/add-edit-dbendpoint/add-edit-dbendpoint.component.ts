import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-dbendpoint',
  templateUrl: './add-edit-dbendpoint.component.html',
  styleUrls: ['./add-edit-dbendpoint.component.scss']
})
export class AddEditDbendpointComponent implements OnInit {

  addEditForm: FormGroup;
  selectedEndpoint: any;
  submitted: boolean = false;
  routeInfo = {
    path: '',
    isViewOnly: false,
    isEditMode: false
  };
  loader = {
    formData: false,
    saveEndpoint: false
  };
  appState: any;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dbEndpointsService: DBEndpointsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private commonService: CommonService
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
    this.appState = this.commonService.getState();
    this.formInit();
    if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
      this.setFormValues();
    }
    this.getUserInfo();
  }

  ngOnDestroy() {
    delete this.appState.selectedEndpoint;
    this.commonService.setState(this.appState);
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      DB_ID: ['', Validators.required],
      HOST: ['', Validators.required],
      DB_NAME: ['', Validators.required],
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['User', Validators.required],
    });
  }

  getUserInfo() {
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      this.addEditForm.controls.UPDATED_BY.patchValue(this.appState.loggedInUser.USER_NAME);
    }
  }
  setFormValues() {
    if (this.appState && this.appState.selectedEndpoint) {
      this.selectedEndpoint = this.appState.selectedEndpoint;
      const formControls = this.addEditForm.controls;
      if (this.selectedEndpoint) {
        for (const key in formControls) {
          if (formControls.hasOwnProperty(key)) {
            const element = formControls[key];
            element.patchValue(this.selectedEndpoint[key]);
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
    this.loader.saveEndpoint = true;
    let formValues = Object.assign({}, this.addEditForm.value);
    formValues.UPDATE_DATE = `${new Date()}`;
    let tempEndpoint = formValues;

    let body = {
      endpoint: tempEndpoint,
      ID: ''
    };
    let functionToCall = 'addEndpoint';
    if (this.routeInfo.isEditMode) {
      functionToCall = 'updateEndpoint';
      body.ID = this.selectedEndpoint.DB_ID
    }

    // if (this.routeInfo.isEditMode) {
    this.dbEndpointsService[functionToCall](body).subscribe((data: any) => {
      if (data && !data.error) {
        this.showToast('success', 'Successfully Saved.');
        this.router.navigate(['/db-endpoints']);
      } else {
        this.showToast('error', 'Could not save data.');
      }
      this.loader.saveEndpoint = false;
    }, error => {
      this.showToast('error', 'Could not save data.');
      this.loader.saveEndpoint = false;
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }
}
