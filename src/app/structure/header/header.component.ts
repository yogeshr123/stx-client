import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }
  ngOnInit() {
  }

  logout() {
    localStorage.clear();
    // this.router.navigateByUrl('/logout');
    window.location.href = environment.ssoLogoutURL;
  }

  hideSidebar() {
    $('.app').toggleClass('sidenav-toggled');
  }
}





