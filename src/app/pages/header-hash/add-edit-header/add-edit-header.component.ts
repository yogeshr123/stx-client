import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { headerMismatchesTableCols } from '../tableColumns';
import { HeaderHashService } from 'src/app/services/header-hash.service';

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
  headerMismatches: any;
  headerMismatchesTableCols = headerMismatchesTableCols;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private headerHashService: HeaderHashService
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
    }
    this.getHeaderMismatches();
  }

  getHeaderMismatches() {
    const request = {
      table_name: this.TABLE_NAME,
      header_hash: this.routeInfo.id
    };
    this.headerHashService.getHeaderMismatches(request).subscribe((res: any) => {
      this.headerMismatches = res.data;
    }, error => {
      console.error('error ', error);
    });
  }

  approveHeader() {
    this.headerHashService.approveHeader({}).subscribe((resp: any) => {
      console.log('res ', resp);
      if (resp && !resp.error) {
        this.showToast('success', 'Successfully Approved');
        this.ngOnInit();
      } else {
        this.showToast('error', 'Approval failed');
      }
    }, error => {
      this.showToast('error', 'Approval failed');
      console.error('error ', error);
    });
  }

  goBack() {
    this.location.back();
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
