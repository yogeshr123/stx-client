import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root'
})
export class LoadControlService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getRecords() {
        const url = `${environment.baseUrl}table_load_control`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addRecord(record: any) {
        const url = `${environment.baseUrl}table_load_control`;
        return this.http
            .post(url, record)
            .pipe(catchError(this.commonService.handleError));
    }

    updateRecord(record: any) {
        const url = `${environment.baseUrl}table_load_control`;
        return this.http
            .put(url, record)
            .pipe(catchError(this.commonService.handleError));
    }

    changeETLStatus(body: any) {
        const url = `${environment.baseUrl}table_load_control/changeETLStatus`;
        return this.http
            .put(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    getQueryResult(body: any) {
        const url = `${environment.baseUrl}table_load_control/query`;
        return this.http
            .post(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    getSearchQueryResult(body: any) {
        const url = `${environment.baseUrl}table_load_control/searchQuery`;
        return this.http
            .post(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    resetExecutionStatus(body: any) {
        const url = `${environment.baseUrl}table_load_control/resetExecutionStatus`;
        return this.http
            .put(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    changeStatus(body: any) {
        const url = `${environment.baseUrl}table_load_control/changeStatus`;
        return this.http
            .put(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    setSchedulerInterval(body: any) {
        const url = `${environment.baseUrl}table_load_control/scheduledag`;
        return this.http
            .put(url, body)
            .pipe(catchError(this.commonService.handleError));
    }

    getColumnDataType() {
        const url = `${environment.baseUrl}table_load_control/columnDataType`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getDistinctSchemaNames() {
        const url = `${environment.baseUrl}table_load_control/schemaNames`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getDistinctTableNames() {
        const url = `${environment.baseUrl}table_load_control/tableNames`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }
}