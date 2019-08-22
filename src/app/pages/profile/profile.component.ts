import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { isNullOrUndefined } from 'util';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';
import { each, find } from 'lodash';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  editUserForm: FormGroup;
  appState: any;
  currentUser: any;
  currentUserRole: string;
  submitted = false;
  uploadedFiles: any[] = [];
  imgURL: any;
  roles: any;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private commonService: CommonService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.appState = this.commonService.getState();
    if (!isNullOrUndefined(this.appState.loggedInUser)) {
      this.currentUser = this.appState.loggedInUser;
      this.currentUser.PROFILE_PIC = `data:image/jpeg;base64,${this.currentUser.PROFILE_PIC}`;
    }
    if (!isNullOrUndefined(this.appState.loggedInUserRole)) {
      this.currentUserRole = this.appState.loggedInUserRole;
    }
    this.imgURL = this.currentUser.PROFILE_PIC;
    this.formInit();
  }

  formInit() {
    this.editUserForm = this.formBuilder.group({
      USER_NAME: [{ value: this.currentUser.USER_NAME, disabled: true }],
      EMAIL_ID: [{ value: this.currentUser.EMAIL_ID, disabled: true }],
      ROLE: [{ value: this.currentUserRole, disabled: true }],
      FULL_NAME: [this.currentUser.FULL_NAME, Validators.required],
      PROFILE_PIC: [this.currentUser.PROFILE_PIC]
    });
  }

  get f() {
    return this.editUserForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.editUserForm.invalid) {
      return;
    }

    const formValues = Object.assign({}, this.editUserForm.value);

    const body = {
      user: {
        ID: this.currentUser.ID,
        PROFILE_PIC: this.b64toBlob(this.imgURL),
        FULL_NAME: formValues.FULL_NAME
      }
    };
    this.usersService.updateUser(body).subscribe((data: any) => {
      this.showToast('success', 'Successfully updated user.');
      if (body.user.FULL_NAME) {
        this.appState.loggedInUser.FULL_NAME = body.user.FULL_NAME;
      }
      if (body.user.PROFILE_PIC) {
        this.appState.loggedInUser.PROFILE_PIC = btoa(body.user.PROFILE_PIC);
      }
      this.commonService.setState(this.appState);
      this.usersService.toggleProfile();
      // this.confirmationService.confirm({
      //   rejectVisible: false,
      //   acceptLabel: 'Ok',
      //   message: 'User profile updated. Please login again...',
      //   accept: () => {
      //     // this.router.navigateByUrl('/login');
      //   }
      // });
    }, error => {
      this.showToast('error', 'Could not update user profile.');
    });
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/data:image\/(jpeg|gif|png|jpg);base64,/g, '');
    const byteCharacters = atob(b64Data);
    return byteCharacters;
  }


  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.showToast('info', 'File Uploaded');
  }
  preview(files) {
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.showToast('info', 'Only images are supported.');
      return;
    }

    const FileSize = files[0].size / 1024 / 1024; // in MB
    if (FileSize > 2) {
      this.showToast('warning', 'File size should not exceeds 2 MB.');
      return;
    }
    var reader = new FileReader();
    // this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
}
