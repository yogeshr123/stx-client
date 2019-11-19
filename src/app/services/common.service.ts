import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    state = {};

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    getState() {
        this.state = JSON.parse(localStorage.getItem('appState'));
        if (!this.state) {
            this.state = {};
        }
        return this.state;
    }

    setState(state) {
        this.state = state;
        localStorage.setItem('appState', JSON.stringify(this.state));
        return this.state;
    }

    authenticate(user) {
        const apiUrl = environment.baseUrl.replace('/api/v1/', '');
        const url = `${apiUrl}/profile/auth_user`;
        return this.http.post(url, user).pipe(catchError(this.handleError));
    }

    updateToken(user) {
        const apiUrl = environment.baseUrl.replace('/api/v1/', '');
        const url = `${apiUrl}/profile/updateToken`;
        return this.http.post(url, user).pipe(catchError(this.handleError));
    }

    handleError(error: HttpErrorResponse) {
        console.log('error ', error);
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`
            );
        }
        return throwError(error);
    }
}
