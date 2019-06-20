import { environment } from "../../environments/environment";
// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoadControlService {
    // private headers: Headers;
    private baseURL = environment.baseUrl;

    constructor(
        private httpClient: HttpClient,
    ) {
    }


    getRecords(): Promise<any> {
        return this.httpClient.get(environment.baseUrl)
            .toPromise()
            .then((response) => {
                return response;
            });
    }
}