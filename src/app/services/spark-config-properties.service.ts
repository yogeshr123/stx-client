import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class SparkConfigPropertiesService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }

    getSparkConfigProperties() {
        const url = `${environment.baseUrl}spark_config_properties`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addSparkConfigProperties(endpoint: any) {
        const url = `${environment.baseUrl}spark_config_properties`;
        return this.http
            .post(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }

    updateSparkConfigProperties(endpoint: any) {
        const url = `${environment.baseUrl}spark_config_properties`;
        return this.http
            .put(url, endpoint)
            .pipe(catchError(this.commonService.handleError));
    }
}