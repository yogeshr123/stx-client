import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-column',
  templateUrl: './add-edit-column.component.html',
  styleUrls: ['./add-edit-column.component.css']
})
export class AddEditColumnComponent implements OnInit {

  routeInfo = {
    path: '',
    id: '',
    isViewOnly: false
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.params.subscribe(params => {
      this.routeInfo.id = params.id;
    });
    this.route.url.subscribe(params => {
      this.routeInfo.path = params[0].path;
      if (this.routeInfo.path.indexOf('view') > -1) {
        this.routeInfo.isViewOnly = true;
      }
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
