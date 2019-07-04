import { Component, OnInit } from '@angular/core';
declare var $: any;

export class Stuff {
  public accessToken: string;
  public idToken: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  public stuff: Stuff = new Stuff()
  constructor() {
  }
  ngOnInit() {
  }
}





