import { Component, OnInit } from '@angular/core';
declare var $: any;

export class Stuff {
  public accessToken: string;
  public idToken: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [':host{width: 100%; height: 100%;}']
})
export class HeaderComponent implements OnInit {
  public stuff: Stuff = new Stuff()
  constructor() {
  }
  ngOnInit() {
  }

  hideSidebar() {
    $('.app').toggleClass('sidenav-toggled');
  }
}





