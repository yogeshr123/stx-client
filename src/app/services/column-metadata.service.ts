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

    state = {};

    constructor(
        private commonService: CommonService,
        private http: HttpClient,
    ) {
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
        return this.state;
    }
}
