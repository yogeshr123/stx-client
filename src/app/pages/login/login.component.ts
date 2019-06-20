import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
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
    styles: [':host{width: 100%; height: 100%;}']
    //   styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    errorMessage: string;
    // mfaStep = false;
    // mfaData = {
    //     destination: '',
    //     callback: null
    // };

    constructor(public router: Router,
        // public ddb: DynamoDBService,
        // public userService: UserLoginService,
        // private spinner: NgxSpinnerService
    ) {
    }
    ngOnInit() {
        this.errorMessage = null;
        // // console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        // this.userService.isAuthenticated(this);
    }

    onLogin() {
        // this.spinner.show();
        if (this.email == null || this.password == null) {
            this.errorMessage = "All fields are required";
            // this.spinner.hide();
            return;
        }

        this.errorMessage = null;
        if (DEMO_PARAMS.EMAIL === this.email && DEMO_PARAMS.PASSWORD === this.password) {
            this.router.navigate(['/dashboard']);
        }
        else {
            this.errorMessage = "Invalid credentials";
        }
        // this.userService.authenticate(this.email, this.password, this);
        // this.spinner.hide();
    }

    // cognitoCallback(message: string, result: any) {
    //     if (message != null) { //error
    //         this.errorMessage = message;
    //         // console.log("result: " + this.errorMessage);
    //         // if (this.errorMessage === 'User is not confirmed.') {
    //         //     console.log("redirecting");
    //         //     this.router.navigate(['/home/confirmRegistration', this.email]);
    //         // } else if (this.errorMessage === 'User needs to set password.') {
    //         //     console.log("redirecting to set new password");
    //         //     this.router.navigate(['/home/newPassword']);
    //         // }
    //     } else { //success
    //         // this.ddb.writeLogEntry("login");
    //         this.router.navigate(['/bot']);
    //     }
    // }

    // handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
    //     this.mfaStep = true;
    //     this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
    //     this.mfaData.callback = (code: string) => {
    //         if (code == null || code.length === 0) {
    //             this.errorMessage = "Code is required";
    //             return;
    //         }
    //         this.errorMessage = null;
    //         callback(code);
    //     };
    // }

    // isLoggedIn(message: string, isLoggedIn: boolean) {
    //     if (isLoggedIn) {
    //         this.router.navigate(['/bot']);
    //     }
    // }

    // cancelMFA(): boolean {
    //     this.mfaStep = false;
    //     return false;   //necessary to prevent href navigation
    // }
}

