import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styles: [':host{width: 100%; height: 100%;}']
})
export class BaseComponent implements OnInit {
    constructor() {
    }
    ngOnInit() {
    }
}