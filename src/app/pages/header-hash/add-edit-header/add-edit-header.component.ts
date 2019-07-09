import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-header',
  templateUrl: './add-edit-header.component.html',
  styleUrls: ['./add-edit-header.component.scss']
})
export class AddEditHeaderComponent implements OnInit {

  addEditHeaderForm: FormGroup;
  routeInfo = {
    path: '',
    id: '',
    isViewOnly: false,
    isEditMode: false
  };
  TABLE_NAME: any;
  appState: any;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.routeInfo.id = params.headerId;
    });
    this.route.url.subscribe(params => {
      this.routeInfo.path = params[0].path;
      if (this.routeInfo.path.indexOf('view') > -1) {
        this.routeInfo.isViewOnly = true;
      }
      if (this.routeInfo.path.indexOf('edit') > -1) {
        this.routeInfo.isEditMode = true;
      }
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
