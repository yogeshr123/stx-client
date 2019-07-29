import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-dim-lookup',
  templateUrl: './dim-lookup.component.html',
  styleUrls: ['./dim-lookup.component.scss']
})
export class DimLookupComponent implements OnInit {

  selectedTable: any;
  constructor(
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.selectedTable = this.config.data;
    console.log("this.selectedTable ", this.selectedTable);
  }

}
