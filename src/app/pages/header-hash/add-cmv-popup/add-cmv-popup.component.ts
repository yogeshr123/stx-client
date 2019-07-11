import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-add-cmv-popup',
  templateUrl: './add-cmv-popup.component.html',
  styleUrls: ['./add-cmv-popup.component.scss']
})
export class AddCmvPopupComponent implements OnInit {

  header: any;
  status: any;

  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.header = this.config.data.header;
    this.status = this.config.data.status;
  }

  closePopUp() {
  }

}
