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
    this.appState = JSON.parse(localStorage.getItem('appState'));
    if (this.appState && this.appState.CMV && this.appState.CMV.selectedTable) {
      this.TABLE_NAME = this.appState.CMV.selectedTable.TABLE_NAME;
      // this.addEditColumnForm.controls.SCHEMA_NAME.patchValue(this.appState.CMV.selectedTable.SCHEMA_NAME);
      // this.addEditColumnForm.controls.TABLE_NAME.patchValue(this.appState.CMV.selectedTable.TABLE_NAME);
      // this.addEditColumnForm.controls.METADATA_VERSION.patchValue(this.appState.CMV.selectedTable.METADATA_VERSION);
    }
  }

  goBack() {
    this.location.back();
  }

}
