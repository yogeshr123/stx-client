import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './services/common.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'stx-clientUI';

    constructor(private commonService: CommonService, private router: Router) {}

    ngOnInit() {
        this.router.events.subscribe(evt => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        this.authenticateUser();
    }

    authenticateUser() {
        const appState = JSON.parse(localStorage.getItem('appState'));
        if (
            appState &&
            appState.loggedInUser &&
            appState.loggedInUser.USER_NAME
        ) {
            this.commonService
                .authenticate({
                    userName: appState.loggedInUser.USER_NAME,
                })
                .subscribe((resp: any) => {
                    const currentState = { ...appState };
                    currentState.loggedInUser.token = resp.data.token;
                    currentState.loggedInUser.refreshToken =
                        resp.data.refreshToken;
                    this.commonService.setState(currentState);
                });
        }
    }
}
