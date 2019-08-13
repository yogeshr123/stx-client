import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { User } from '../model/users.table';

@Injectable()
export class AuthService {
    isLoggedIn = false;
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    login(user: any) {
        const url = `${environment.baseUrl}users/login`;
        return this.http
            .post(url, user)
            .pipe(catchError(this.commonService.handleError));
    }
}