import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
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
}