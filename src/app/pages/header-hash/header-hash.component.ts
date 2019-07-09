import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderHashService } from 'src/app/services/header-hash.service';

import { initColumnState, columnTableColumns } from './tableColumns';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-header-hash',
  templateUrl: './header-hash.component.html',
  styleUrls: ['./header-hash.component.css']
})
export class HeaderHashComponent implements OnInit {

  headers: any;
  selectedColumns: any;
  selectedTableName: any;
  uniqueTables: any;
  columnTableColumns = columnTableColumns;
  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private headerHashService: HeaderHashService
  ) { }

  ngOnInit() {
    this.getHeaders();
    this.getSelectedColumns();
    this.getAllTables();
  }

  getSelectedColumns() {
    if (!localStorage.getItem('selectedHeaderColumns')) {
      this.initColumnState();
    } else {
      // get selected columns from local storage
      this.selectedColumns = JSON.parse(localStorage.getItem('selectedHeaderColumns'));
    }
  }

  saveColumnState() {
    localStorage.setItem('selectedHeaderColumns', JSON.stringify(this.selectedColumns));
    this.resetFilters();
  }

  resetTable() {
    const statefilter = JSON.parse(localStorage.getItem('stateSelectedVersionColumns'));
    if (statefilter) {
      localStorage.removeItem('stateSelectedVersionColumns');
    }
    const columnState = JSON.parse(localStorage.getItem('selectedHeaderColumns'));
    if (columnState) {
      localStorage.removeItem('selectedHeaderColumns');
      this.initColumnState();
    }
    this.tableComponent.reset();
  }

  resetFilters() {
    const statefilter = JSON.parse(localStorage.getItem('stateSelectedVersionColumns'));
    if (statefilter) {
      localStorage.removeItem('stateSelectedVersionColumns');
    }
    this.tableComponent.reset();
  }

  initColumnState() {
    this.selectedColumns = initColumnState;
  }

  getAllTables() {
    this.headerHashService.getAllTables().subscribe((res: any) => {
      const allTables = res.data;
      this.uniqueTables = this.removeDuplicates(allTables, 'TABLE_NAME');
    }, error => {
      console.error('error ', error);
    });
  }

  getHeaders() {
    const request = { table_name: 'P250_ERROR_RATE_BY_ZONE_FACT' };
    this.headerHashService.getHeaders(request).subscribe((res: any) => {
      // console.log("res ", res);
      this.headers = res.data;
    }, error => {
      console.error('error ', error);
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

}
