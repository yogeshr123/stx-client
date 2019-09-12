import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { RolesService } from 'src/app/services/roles.service';

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
  roles: any;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private rolesService: RolesService
  ) {
  }
  ngOnInit() {
    this.errorMessage = null;
    this.loadRoles();
    this.formInit();
  }

  formInit() {
    this.registerForm = this.formBuilder.group({
      USER_NAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
      ROLE: ['', Validators.required],
      UPDATED_BY: ['User'],
      UPDATE_DATE: [new Date()]
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    let formValues = Object.assign({}, this.registerForm.value);
    this.registerForm.controls.UPDATED_BY.patchValue(formValues.USER_NAME);
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

  loadRoles() {
    this.rolesService.getRoles().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.roles = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}

