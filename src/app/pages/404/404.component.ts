import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-logout',
    templateUrl: './404.component.html',
    styleUrls: ['./404.component.scss'],
})
export class NotFoundComponent implements OnInit {
    constructor(private location: Location) {}

    ngOnInit() {}

    goBack() {
        this.location.back(); // <-- go back to previous location on cancel
    }
}
