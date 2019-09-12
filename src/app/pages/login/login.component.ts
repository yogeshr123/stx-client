import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { PermissionsService } from 'src/app/services/permissions.service';
import { RolesService } from 'src/app/services/roles.service';
import { Permission } from 'src/app/model/permissions.table';
import { CommonService } from 'src/app/services/common.service';
// import { UserLoginService } from "../service/user-login.service";
// import { ChallengeParameters, CognitoCallback, LoggedInCallback } from "../service/cognito.service";
// import { NgxSpinnerService } from 'ngx-spinner';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare var $: any;

const DEMO_PARAMS = {
    EMAIL: 'admin@demo.com',
    PASSWORD: 'demo'
};


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
    //   styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    errorMessage: string;
    loginForm: FormGroup;
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
        private authService: AuthService,
        private messageService: MessageService,
        private permissionsService: PermissionsService,
        private rolesService: RolesService,
        private commonService: CommonService
    ) {
    }
    ngOnInit() {
        this.errorMessage = null;
        this.formInit();
        this.appState = this.commonService.getState();
        this.loadPermissions();
        // // console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        // this.userService.isAuthenticated(this);
    }

    formInit() {
        this.loginForm = this.formBuilder.group({
            USER_NAME: ['', Validators.required],
            PASSWORD: ['', Validators.required],
        });
    }
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        let formValues = Object.assign({}, this.loginForm.value);

        const body = {
            user: formValues
        };
        this.authService.login(body).subscribe((data: any) => {
            if (data.data) {
                this.currentUser = data.data;
                this.fetchLoggedInUserDetails();
            }
        }, error => {
            this.showToast('error', 'User failed to login. ' + error.error.message);
        });
    }

    fetchLoggedInUserDetails() {
        if (this.currentUser.ID != null && this.currentUser.ID != undefined && this.currentUser.ID != '0') {
            this.isLoggedIn = true;
        } else {
            this.isLoggedIn = false;
        }
        if (this.isLoggedIn) {
            this.appState = { ...this.appState, loggedInUser: this.currentUser };
            this.commonService.setState(this.appState);
            this.rolesService.getRoleById(this.currentUser.ROLE).subscribe((data: any) => {
                if (data.data) {
                    this.currentUserRole = data.data;
                    this.currentUserRole.PERMISSIONSARRAY = this.currentUserRole.PERMISSIONS.split(',').map(Number);
                    this.appState = { ...this.appState, loggedInUserRole: this.currentUserRole.TITLE };
                    this.commonService.setState(this.appState);
                    const mainPermissions = this.permissions.filter(el => !el.PARENT);
                    mainPermissions.forEach((element: Permission) => {
                        const hasUserPermission = this.currentUserRole.PERMISSIONSARRAY.some(t => t === element.ID);
                        if (hasUserPermission)
                            this.currentUserPermissions.push(element.NAME);
                        const children = this.permissions.filter(el => el.PARENT && el.PARENT === element.ID);
                        children.forEach(child => {
                            const hasUserChildPermission = this.currentUserRole.PERMISSIONSARRAY.some(t => t === child.ID);
                            if (hasUserChildPermission)
                                this.currentUserPermissions.push(child.NAME);
                        });
                    });
                    this.appState = { ...this.appState, loggedInUserPermissions: this.currentUserPermissions };
                    this.commonService.setState(this.appState);
                    this.router.navigateByUrl('/dashboard');
                }
            }, error => {
                this.showToast('error', 'Error while fetching data.');
            });

        }
    }

    loadPermissions() {
        this.permissionsService.getPermissions().subscribe((data: any) => {
            if (data.data && data.data.length > 0) {
                this.permissions = data.data;
            }
        }, error => {
            this.showToast('error', 'Error while fetching data.');
        });
    }

    getUserPermissions() {

    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }
}

