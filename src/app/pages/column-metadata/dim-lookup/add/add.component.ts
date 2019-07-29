import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  selectedTable: any;
  schemaNames = [{ label: 'DIM 1' }, { label: 'DIM 2' }, { label: 'DIM 3' }, { label: 'DIM 4' }];
  schemaTables = [{ label: 'SBR_DIM' }, { label: 'DATE_DIM' }, { label: 'PRODUCT_DIM' }, { label: 'LOCATION_DIM' }];

  constructor(public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.selectedTable = this.config.data;
  }

}
