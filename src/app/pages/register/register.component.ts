import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string;
  registerForm: FormGroup;
  submitted = false;
  currentUser: any;
  currentUserRole: any;
  currentUserPermissions: string[] = [];
  isLoggedIn = false;
  permissions: any;
  appState: any;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
  ) {
  }
  ngOnInit() {
    this.errorMessage = null;
    this.formInit();
  }

  formInit() {
    this.registerForm = this.formBuilder.group({
      USER_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
      UPDATED_BY: ['User'],
      UPDATE_DATE: [new Date()]
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  getUserInfo() {
    if (this.appState.loggedInUser && this.appState.loggedInUser.USER_NAME) {
      this.registerForm.controls.UPDATED_BY.patchValue(this.appState.loggedInUser.USER_NAME);
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    let formValues = Object.assign({}, this.registerForm.value);
    const body = {
      user: formValues
    };

    this.usersService.addUser(body).subscribe((data: any) => {
      this.showToast('success', 'user created.');
      this.router.navigate(['/superlogin']);
    }, error => {
      this.showToast('error', 'User failed to register. ' + error.error.message);
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}

