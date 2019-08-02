import { environment } from '../../environments/environment';
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable()
export class AirflowService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) {
    }
}