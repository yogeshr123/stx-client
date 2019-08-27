import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { PermissionsService } from 'src/app/services/permissions.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styleUrls: ['./add-edit-permission.component.scss']
})
export class AddEditPermissionComponent implements OnInit {
  addEditForm: FormGroup;
  selectedPermission: any;
  permissions: any;
  parentPermissions: any;
  submitted: boolean = false;
  isNew: boolean = true;
  appModulesList = environment.appModulesList;
  defaultPermissions = environment.defaultPermissions;
  appState: any;
  constructor(
    private formBuilder: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private permissionsService: PermissionsService,
    private messageService: MessageService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.appState = this.commonService.getState();
    this.selectedPermission = this.config.data.selectedPermission;
    this.permissions = this.config.data.permissions;
    if (this.permissions) {
      this.parentPermissions = this.permissions.filter(el => !el.PARENT);
    }

    this.isNew = this.config.data.isNew;
    this.formInit();
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      module: ['', Validators.required]
      // TITLE: [this.selectedPermission.TITLE, Validators.required],
      // NAME: [this.selectedPermission.NAME, Validators.required],
      // PARENT: [this.selectedPermission.PARENT],
    });
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

    let formValues = Object.assign({}, this.addEditForm.value);
    // let tempPermission = formValues;
    let UPDATE_DATE = `${new Date()}`;
    let UPDATED_BY = '';
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      UPDATED_BY = this.appState.loggedInUser.USER_NAME;
    }

    if (this.isNew) {
      const name = this.camelCase('access' + formValues.module + 'Module');
      const isPermissionExist = this.permissions.find(permission => permission.NAME === name);
      if (!isPermissionExist) {
        const body = {
          module: formValues.module,
          defaultPermissions: this.defaultPermissions,
          UPDATE_DATE: UPDATE_DATE,
          UPDATED_BY: UPDATED_BY
        };
        this.permissionsService.addPermission(body).subscribe((data: any) => {
          this.showToast('success', 'permission saved.');
          this.closeModal(true);
        }, error => {
          this.showToast('error', 'Could not save permission.');
        });
      }
      else {
        this.showToast('error', 'Permission already exists.');
      }

    }
  }

  closeModal(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
}
