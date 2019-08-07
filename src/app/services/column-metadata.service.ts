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

    localCopyOfVersion: any;
    columnInfo: any;

    getLocalCopyOfVersion() {
        const localCopyOfVersion = JSON.parse(localStorage.getItem('localCopyOfVersion'));
        if (localCopyOfVersion) {
            return localCopyOfVersion;
        }
        return this.localCopyOfVersion;
    }

    setLocalCopyOfVersion(version) {
        localStorage.setItem('localCopyOfVersion', JSON.stringify(version));
        return true;
    }

    getColumnToEdit() {
        return this.columnInfo;
    }

    setColumnToEdit(columnInfo) {
        this.columnInfo = columnInfo;
        return true;
    }

    getAllTablesInVersions() {
        const url = `${environment.baseUrl}column-metadata/getAllTablesInVersions`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getAllLoadControlTables() {
        const url = `${environment.baseUrl}column-metadata/getAllLoadControlTables`;
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

    getTableLookUps(tableData) {
        const url = `${environment.baseUrl}column-metadata/lookups`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    saveFactColumns(tableData) {
        const url = `${environment.baseUrl}column-metadata/saveFactColumns`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    getRefreshTables() {
        const url = `${environment.baseUrl}column-metadata/getRefreshTables`;
        return this.http
            .get(url)
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

    deleteLookups(lookupData) {
        const url = `${environment.baseUrl}column-metadata/deleteLookups`;
        return this.http
            .post(url, lookupData)
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

    addLookUp(lookUpData) {
        const url = `${environment.baseUrl}column-metadata/addLookups`;
        return this.http
            .post(url, lookUpData)
            .pipe(catchError(this.commonService.handleError));
    }

    deleteColumn(columnData) {
        const url = `${environment.baseUrl}column-metadata/deleteColumn`;
        return this.http
            .post(url, columnData)
            .pipe(catchError(this.commonService.handleError));
    }

    saveMaster(columnData) {
        const url = `${environment.baseUrl}column-metadata/saveMaster`;
        return this.http
            .post(url, columnData)
            .pipe(catchError(this.commonService.handleError));
    }

    getTableInfoFromLoadControl(table) {
        const url = `${environment.baseUrl}column-metadata/getTableInfoFromLoadControl`;
        return this.http
            .post(url, table)
            .pipe(catchError(this.commonService.handleError));
    }
}
