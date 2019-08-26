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
export class HeaderHashService {

    constructor(
        private commonService: CommonService,
        private http: HttpClient,
    ) {
    }

    getHeaders(tableData) {
        const url = `${environment.baseUrl}header-hash`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    fileHeaderHashErrorTable() {
        const url = `${environment.baseUrl}header-hash/fileHeaderHashErrorTable`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getHeaderByHash(tableData) {
        const url = `${environment.baseUrl}header-hash/getHeaderByHash`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    getAllTables() {
        const url = `${environment.baseUrl}header-hash/getAllTables`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    getHeaderMismatches(tableData) {
        const url = `${environment.baseUrl}header-hash/getHeaderMismatches`;
        return this.http
            .post(url, tableData)
            .pipe(catchError(this.commonService.handleError));
    }

    approveHeader(header) {
        const url = `${environment.baseUrl}header-hash/approveHeader`;
        return this.http
            .put(url, header)
            .pipe(catchError(this.commonService.handleError));
    }

    addToColumnMetadata(columnData) {
        const url = `${environment.baseUrl}header-hash/addToColumnMetadata`;
        return this.http
            .post(url, columnData)
            .pipe(catchError(this.commonService.handleError));
    }

}
