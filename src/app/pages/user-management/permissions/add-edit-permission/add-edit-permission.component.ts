import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { PermissionsService } from 'src/app/services/permissions.service';

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
  constructor(
    private formBuilder: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private permissionsService: PermissionsService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.selectedPermission = this.config.data.selectedPermission;
    this.permissions = this.config.data.permissions;
    this.parentPermissions = this.permissions.filter(el => !el.PARENT);
    this.isNew = this.config.data.isNew;
    this.formInit();
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      TITLE: [this.selectedPermission.TITLE, Validators.required],
      NAME: [this.selectedPermission.NAME, Validators.required],
      PARENT: [this.selectedPermission.PARENT],
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
    let tempPermission = formValues;
    if (this.isNew) {
      const body = {
        permission: tempPermission
      };
      this.permissionsService.addPermission(body).subscribe((data: any) => {
        this.showToast('success', 'permission saved.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not save permission.');
      });
    }
    else {
      tempPermission.ID = this.selectedPermission.ID;
      const body = {
        permission: tempPermission
      };
      this.permissionsService.updatePermission(body).subscribe((data: any) => {
        this.showToast('success', 'permission updated.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not update permission.');
      });
    }
  }

  closeModal(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}
