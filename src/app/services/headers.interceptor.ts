import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private toastr: ToastrService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const appState = JSON.parse(localStorage.getItem('appState'));
        if (appState.loggedInUser && appState.loggedInUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${appState.loggedInUser.token}`,
                },
            });
        }
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    this.toastr.error(
                        'TokenExpiredError: Your Auth Token has expired'
                    );
                }
                return throwError(error);
            })
        );
    }
}
