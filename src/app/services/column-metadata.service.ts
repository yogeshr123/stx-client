import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class ColumnMetadataService {

    constructor(
        private commonService: CommonService,
        private http: HttpClient,
    ) {
    }

    getAllTablesInVersions() {
        const url = `${environment.baseUrl}column-metadata/getAllTablesInVersions`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getTableVersions(tableData) {
        const url = `${environment.baseUrl}column-metadata/version`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    validateVersion(version) {
        const url = `${environment.baseUrl}column-metadata/validateVersion`;
        return this.http
            .post(url, version)
            .pipe(catchError(this.commonService.handleError));
    }

    getAllColumns(tableData) {
        const url = `${environment.baseUrl}column-metadata/getAllColumns`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    getSingleColumn(tableData) {
        const url = `${environment.baseUrl}column-metadata/getSingleColumns`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    generateNewVersion(tableData) {
        const url = `${environment.baseUrl}column-metadata/generateNewVersion`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    updateColumn(columnData) {
        const url = `${environment.baseUrl}column-metadata/updateColumn`;
        return this.http
            .put(url, columnData)
            .pipe(catchError(this.commonService.handleError));
    }

    addColumn(columnData) {
        const url = `${environment.baseUrl}column-metadata/addColumn`;
        return this.http
            .post(url, columnData)
            .pipe(catchError(this.commonService.handleError));
    }
}
