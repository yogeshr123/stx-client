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
export class ClustersService {

    constructor(
        private commonService: CommonService,
        private http: HttpClient,
    ) {
    }

    getClusters() {
        const url = `${environment.baseUrl}clusters`;
        return this.http
            .get(url)
            .pipe(catchError(this.commonService.handleError));
    }

    addCluster(cluster) {
        const url = `${environment.baseUrl}clusters/addCluster`;
        return this.http
            .post(url, cluster)
            .pipe(catchError(this.commonService.handleError));
    }
}
