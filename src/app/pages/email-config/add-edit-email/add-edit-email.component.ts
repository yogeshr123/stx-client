import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EmailConfigService } from 'src/app/services/email-config.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-email',
  templateUrl: './add-edit-email.component.html',
  styleUrls: ['./add-edit-email.component.scss']
})
export class AddEditEmailComponent implements OnInit, OnDestroy {

  addEditEmailForm: FormGroup;
  routeInfo = {
    path: '',
    isViewOnly: false,
    isEditMode: false
  };
  loader = {
    formData: false,
    saveEmail: false
  };
  oldEmailInfo: any;
  emailList = [];
  submitted = false;

  constructor(
    private commonService: CommonService,
    private emailService: EmailConfigService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
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
    this.formInit();
    if (this.routeInfo.isEditMode || this.routeInfo.isViewOnly) {
      this.setFormValues();
    }
    this.getUserInfo();
  }

  formInit() {
    this.addEditEmailForm = this.formBuilder.group({
      EMAIL_GROUP: ['', Validators.required],
      EMAIL_ADDRESSES: ['', Validators.compose([Validators.email])],
      UPDATE_DATE: [new Date(), Validators.required],
      UPDATED_BY: ['User', Validators.required],
    });
  }

  get f() { return this.addEditEmailForm.controls; }

  getUserInfo() {
    const appState = JSON.parse(localStorage.getItem('appState'));
    if (appState.loggedInUser && appState.loggedInUser.USER_NAME) {
      this.addEditEmailForm.controls.UPDATED_BY.patchValue(appState.loggedInUser.USER_NAME);
    }
  }

  setFormValues() {
    this.oldEmailInfo = this.emailService.getEmailObject();
    const appState: any = this.commonService.getState();
    if (appState && appState.selectedEmailConfig) {
      const cluster = appState.selectedEmailConfig;
      this.oldEmailInfo = appState.selectedEmailConfig;
      const formControls = this.addEditEmailForm.controls;
      if (cluster) {
        for (const key in formControls) {
          if (formControls.hasOwnProperty(key)) {
            if (key === 'EMAIL_ADDRESSES') {
              let emails = cluster[key].split(',');
              emails = emails.map(i => i.replace(/'/g, ''));
              this.emailList = emails;
            } else {
              const element = formControls[key];
              element.patchValue(cluster[key]);
            }
          }
        }
      }
    }
  }

  addEmailAdd() {
    if (this.addEditEmailForm.value.EMAIL_ADDRESSES) {
      this.emailList.push(this.addEditEmailForm.value.EMAIL_ADDRESSES);
      this.addEditEmailForm.controls.EMAIL_ADDRESSES.patchValue('');
    }
  }

  deleteEmail(item) {
    this.emailList = this.emailList.filter(i => i !== item);
  }

  onSubmit() {
    this.submitted = true;
    this.loader.saveEmail = true;
    if (this.addEditEmailForm.invalid) {
      this.loader.saveEmail = false;
      return;
    }
    const formValues = Object.assign({}, this.addEditEmailForm.value);
    if (this.emailList.length) {
      formValues.EMAIL_ADDRESSES = `'${this.emailList.join("','")}'`;
      if (this.addEditEmailForm.value.EMAIL_ADDRESSES) {
        formValues.EMAIL_ADDRESSES = `${formValues.EMAIL_ADDRESSES},'${this.addEditEmailForm.value.EMAIL_ADDRESSES}'`;
      }
    } else {
      formValues.EMAIL_ADDRESSES = `'${formValues.EMAIL_ADDRESSES}'`;
    }
    const request = { email: formValues, oldEmailInfo: '' };
    request.email.UPDATE_DATE = `${new Date()}`;
    let functionToCall = 'addEmailConfig';
    if (this.routeInfo.isEditMode) {
      functionToCall = 'updateEmailConfig';
      request.oldEmailInfo = this.oldEmailInfo;
    }
    this.emailService[functionToCall](request).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Successfully Saved.');
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        this.showToast('error', 'Could not save data.');
      }
      this.loader.saveEmail = false;
    }, error => {
      this.loader.saveEmail = false;
      this.showToast('error', 'Could not save data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    const appState = JSON.parse(localStorage.getItem('appState'));
    delete appState.selectedEmailConfig;
    this.commonService.setState(appState);
  }

}
