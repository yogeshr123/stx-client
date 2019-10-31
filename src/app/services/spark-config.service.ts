import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root'
})
export class SparkConfigService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getSparkConfig() {
        const url = `${environment.baseUrl}spark_config`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addSparkConfig(endpoint: any) {
        const url = `${environment.baseUrl}spark_config`;
        return this.http
            .post(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }

    updateSparkConfig(endpoint: any) {
        const url = `${environment.baseUrl}spark_config`;
        return this.http
            .put(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }
}