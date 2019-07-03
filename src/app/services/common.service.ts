import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CommonService {

    state = {};

    constructor() { }

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

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        return throwError(error);
    }

}
