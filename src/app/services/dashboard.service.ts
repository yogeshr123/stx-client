import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
  ) {
  }

  getDataLatency(env) {
    const url = `${environment.baseUrl}dashboard/data-latency?env=${env}`;
    return this.http
      .get(url)
      .pipe(catchError(this.commonService.handleError));
  }

  getLoadControlStatus(env) {
    const url = `${environment.baseUrl}dashboard/load-control-status?env=${env}`;
    return this.http
      .get(url)
      .pipe(catchError(this.commonService.handleError));
  }

  getLoadControlDetails(data) {
    const url = `${environment.baseUrl}dashboard/load-control-status/details`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.commonService.handleError));
  }

  getLatencyDetails(data) {
    const url = `${environment.baseUrl}dashboard/data-latency/details`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.commonService.handleError));
  }
}
