import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/users.table';
import { isNullOrUndefined } from 'util';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  appState: any;
  constructor(
    private router: Router,
    private commonService: CommonService
  ) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.appState = this.commonService.getState();
    if (isNullOrUndefined(this.appState.loggedInUser)) {
      this.router.navigateByUrl('/superlogin');
      return false;
    }
    const expectedPermission = route.data.expectedPermission;
    if (isNullOrUndefined(this.appState.loggedInUserPermissions)) {
      this.router.navigateByUrl('/unauthorized');
      return false;
    }
    if (!this.appState.loggedInUserPermissions.includes(expectedPermission)) {
      this.router.navigateByUrl('/unauthorized');
      return false;
    }
    return true;
  }
}
