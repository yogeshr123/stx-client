import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root'
})
export class EmailConfigService {

    emailObject: any;

    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getEmailObject() {
        return this.emailObject;
    }

    setEmailObject(emailObject) {
        this.emailObject = emailObject;
    }

    getEmailConfig() {
        const url = `${environment.baseUrl}email_config`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addEmailConfig(endpoint: any) {
        const url = `${environment.baseUrl}email_config/addEmail`;
        return this.http
            .post(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }

    updateEmailConfig(endpoint: any) {
        const url = `${environment.baseUrl}email_config/updateEmail`;
        return this.http
            .put(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }
}