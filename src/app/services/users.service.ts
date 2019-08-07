import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class UsersService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getUsers() {
        const url = `${environment.baseUrl}users`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addUser(user: any) {
        const url = `${environment.baseUrl}users`;
        return this.http
            .post(url, user)
            .pipe(catchError(this.commonService.handleError));
    }

    updateUser(user: any) {
        const url = `${environment.baseUrl}users`;
        return this.http
            .put(url, user)
            .pipe(catchError(this.commonService.handleError));
    }

    deleteUser(ID: number) {
        const url = `${environment.baseUrl}users/${ID}`;
        return this.http
            .delete(url)
            .pipe(catchError(this.commonService.handleError));
    }
}