import { environment } from '../../environments/environment';
// Angular
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    @Output() changeProfile: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {}

    toggleProfile() {
        this.changeProfile.emit();
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
    getUserByUserName(userName: string) {
        const url = `${environment.baseUrl}users/${userName}`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }
}
