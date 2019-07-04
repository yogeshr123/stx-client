import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }

  hideSidebar() {
    $('.app').toggleClass('sidenav-toggled');
  }
}





