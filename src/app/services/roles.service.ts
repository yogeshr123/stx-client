import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class RolesService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getRoles() {
        const url = `${environment.baseUrl}user_roles`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addRole(role: any) {
        const url = `${environment.baseUrl}user_roles`;
        return this.http
            .post(url, role)
            .pipe(catchError(this.commonService.handleError));
    }

    updateRole(role: any) {
        const url = `${environment.baseUrl}user_roles`;
        return this.http
            .put(url, role)
            .pipe(catchError(this.commonService.handleError));
    }

    deleteRoleById(ID: number) {
        const url = `${environment.baseUrl}user_roles/${ID}`;
        return this.http
            .delete(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getRoleById(ID: number) {
        const url = `${environment.baseUrl}user_roles/${ID}`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }
}