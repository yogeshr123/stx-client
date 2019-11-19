import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { switchMap, finalize, filter, take } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private toastr: ToastrService,
        private commonService: CommonService
    ) {}

    // intercept(
    //     request: HttpRequest<any>,
    //     next: HttpHandler
    // ): Observable<
    //     | HttpSentEvent
    //     | HttpHeaderResponse
    //     | HttpProgressEvent
    //     | HttpResponse<any>
    //     | HttpUserEvent<any>
    // > {
    //     const appState = JSON.parse(localStorage.getItem('appState'));
    //     if (appState.loggedInUser && appState.loggedInUser.token) {
    //         request = request.clone({
    //             setHeaders: {
    //                 Authorization: `${appState.loggedInUser.token}`,
    //             },
    //         });
    //     }

    //     return next.handle(request).pipe(
    //         catchError(error => {
    //             if (error instanceof HttpErrorResponse) {
    //                 switch (error.status) {
    //                     case 403:
    //                         return this.handle403Error(request, next);
    //                     default:
    //                         return this.handle403Error(request, next);
    //                 }
    //             } else {
    //                 return throwError(error);
    //             }
    //         })
    //     );

    // return next.handle(request).pipe(
    //     catchError(error => {
    //         if (error instanceof HttpErrorResponse) {
    //             if (error.status === 403) {
    //                 // this.toastr.error(
    //                 //     'TokenExpiredError: Your Auth Token Was expired'
    //                 // );
    //                 this.refreshTokenInProgress = true;
    //                 this.refreshTokenSubject.next(null);
    //                 const user = {
    //                     userName: appState.loggedInUser.USER_NAME,
    //                     refreshToken: appState.loggedInUser.refreshToken,
    //                 };
    //                 return this.commonService.updateToken(user).subscribe(
    //                     (token: any) => {
    //                         console.log('token ', token);
    //                         this.refreshTokenInProgress = false;
    //                         this.refreshTokenSubject.next(token);
    //                         const currentState = {
    //                             ...appState,
    //                         };
    //                         currentState.loggedInUser.token =
    //                             token.data.token;
    //                         this.commonService.setState(currentState);
    //                     },
    //                     (err: any) => {
    //                         console.log('err ', err);
    //                         this.refreshTokenInProgress = false;
    //                         localStorage.clear();
    //                         window.location.href = environment.ssoLogoutURL;
    //                     }
    //                 );
    //             } else {
    //                 return throwError(error);
    //             }
    //         }
    //     })
    // );
    // }

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<
        | HttpSentEvent
        | HttpHeaderResponse
        | HttpProgressEvent
        | HttpResponse<any>
        | HttpUserEvent<any>
        | any
    > {
        const appState = JSON.parse(localStorage.getItem('appState'));
        return next
            .handle(
                this.addTokenToRequest(
                    request,
                    appState &&
                        appState.loggedInUser &&
                        appState.loggedInUser.token
                        ? appState.loggedInUser.token
                        : ''
                )
            )
            .pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {
                        console.log('status ', err.status);
                        switch ((<HttpErrorResponse>err).status) {
                            case 403:
                                return this.handle403Error(request, next);
                            case 400:
                                return <any>this.logout();
                            case 401:
                                return <any>this.logout();
                        }
                    } else {
                        return throwError(err);
                    }
                })
            );
    }

    private addTokenToRequest(
        request: HttpRequest<any>,
        token: string
    ): HttpRequest<any> {
        return request.clone({
            setHeaders: { Authorization: `${token ? token : ''}` },
        });
    }

    private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
        const appState = JSON.parse(localStorage.getItem('appState'));
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject.next(null);
            const user = {
                userName: appState.loggedInUser.USER_NAME,
                refreshToken: appState.loggedInUser.refreshToken,
            };
            return this.commonService.updateToken(user).pipe(
                switchMap((token: any) => {
                    if (token) {
                        const currentState = {
                            ...appState,
                        };
                        currentState.loggedInUser.token = token.data.token;
                        this.commonService.setState(currentState);
                        return next.handle(
                            this.addTokenToRequest(request, token.data.token)
                        );
                    }
                    return <any>this.logout();
                }),
                catchError(err => {
                    console.log('err ', err);
                    return <any>this.logout();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            );
        } else {
            this.isRefreshingToken = false;

            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addTokenToRequest(request, token));
                })
            );
        }
    }

    logout() {
        this.toastr.error('TokenExpiredError: Your Auth Token Was expired');
        localStorage.clear();
        window.location.href = environment.ssoLogoutURL;
    }
}
