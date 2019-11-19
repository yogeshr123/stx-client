import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { isNullOrUndefined } from 'util';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styles: [],
})
export class BaseComponent implements OnInit {
    appState: any;
    loading = true;
    constructor(private router: Router, private commonService: CommonService) {}
    ngOnInit() {
        this.appState = this.commonService.getState();
        if (isNullOrUndefined(this.appState.loggedInUser)) {
            // this.router.navigateByUrl('/superlogin');
            window.location.href = environment.ssoLoginURL;
            return false;
        } else {
            this.loading = false;
        }
    }
}
