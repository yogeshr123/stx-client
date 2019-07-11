import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderHashService } from 'src/app/services/header-hash.service';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';

import { columnTableColumns } from './tableColumns';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-header-hash',
  templateUrl: './header-hash.component.html',
  styleUrls: ['./header-hash.component.scss']
})
export class HeaderHashComponent implements OnInit {

  headers: any;
  selectedColumns: any;
  selectedTable: any;
  uniqueTables: any;
  columnTableColumns = columnTableColumns;
  state: any;
  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private commonService: CommonService,
    private columnMetadataService: ColumnMetadataService,
    private location: Location,
    private headerHashService: HeaderHashService
  ) { }

  ngOnInit() {
    this.state = this.commonService.getState();
    if (this.state.CMV && this.state.CMV.selectedTable) {
      this.selectedTable = this.state.CMV.selectedTable;
      this.getHeaders();
    }
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
    this.selectedColumns = columnTableColumns;
  }

  changeTable() {
    this.state.CMV = { ...this.state.CMV, selectedTable: this.selectedTable };
    this.commonService.setState(this.state);
    this.ngOnInit();
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((res: any) => {
      const allTables = res.data;
      this.uniqueTables = this.removeDuplicates(allTables, 'TABLE_NAME');
      if (!this.state.CMV || !this.state.CMV.selectedTable) {
        this.selectedTable = this.uniqueTables[0];
        this.getHeaders();
      }
    }, error => {
      console.error('error ', error);
    });
  }

  getHeaders() {
    const request = { table_name: this.selectedTable.TABLE_NAME };
    this.headerHashService.getHeaders(request).subscribe((res: any) => {
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

  goBack() {
    this.location.back();
  }

}
