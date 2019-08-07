import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class PermissionsService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getPermissions() {
        const url = `${environment.baseUrl}user_permissions`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addPermission(permission: any) {
        const url = `${environment.baseUrl}user_permissions`;
        return this.http
            .post(url, permission)
            .pipe(catchError(this.commonService.handleError));
    }

    updatePermission(permission: any) {
        const url = `${environment.baseUrl}user_permissions`;
        return this.http
            .put(url, permission)
            .pipe(catchError(this.commonService.handleError));
    }

    deletePermission(ID: number) {
        const url = `${environment.baseUrl}user_permissions/${ID}`;
        return this.http
            .delete(url)
            .pipe(catchError(this.commonService.handleError));
    }
}