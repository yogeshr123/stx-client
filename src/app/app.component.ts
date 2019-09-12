import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from './services/common.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'stx-clientUI';
  appState: any;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.appState = this.commonService.getState();
    if (isNullOrUndefined(this.appState.loggedInUser)) {
      this.router.navigateByUrl('/superlogin');
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
