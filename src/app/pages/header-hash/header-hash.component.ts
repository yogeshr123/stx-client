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
  globalQuery: any;
  showDropDown = false;
  columnNames = [
    'SCHEMA_NAME', 'TABLE_NAME', 'HEADER_HASH', 'COLUMN_STATUS', 'STATUS'
  ];
  operators = ['= " "', '!= " "', 'LIKE " "', 'in " "'];
  seperators = ['AND', 'OR', 'ORDER BY'];
  dropDownValues = this.columnNames;
  globalFilterState = 1;

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
      } else {
        const selectedTable = this.uniqueTables.filter(i => i.TABLE_NAME === this.selectedTable.TABLE_NAME);
        if (selectedTable && selectedTable.length) {
          this.selectedTable = selectedTable[0];
        }
      }
    }, error => {
      console.error('error ', error);
    });
  }

  search(globalQuery) {
    this.getHeaders(globalQuery);
  }

  inputFocusOut() {
    setTimeout(() => {
      this.showDropDown = false;
    }, 500);
  }

  inputFocussed() {
    if (this.globalFilterState === 1) {
      this.showDropDown = true;
    }
  }

  checkInput(event) {
    if (!this.globalQuery) {
      this.dropDownValues = this.columnNames;
      this.showDropDown = true;
      this.globalFilterState = 1;
    }
    if (event.keyCode === 13) {
      return this.search(this.globalQuery);
    }
    if (event.keyCode === 32) {
      this.showDropDown = true;
    }

  }

  filterSelection(item) {
    if (this.globalFilterState === 1) {
      if (this.globalQuery) {
        this.globalQuery = this.globalQuery += item;
      } else {
        this.globalQuery = item;
      }
      this.dropDownValues = this.operators;
    }
    if (this.globalFilterState === 2) {
      if (this.globalQuery) {
        this.globalQuery = this.globalQuery += item;
      } else {
        this.globalQuery = item;
      }
      this.dropDownValues = this.seperators;
    }
    if (this.globalFilterState === 3) {
      if (this.globalQuery) {
        this.globalQuery = this.globalQuery += item;
      } else {
        this.globalQuery = item;
      }
      this.dropDownValues = this.columnNames;
    }
    this.showDropDown = false;
    if (this.columnNames.indexOf(item) > -1) {
      this.globalFilterState = 2;
    }
    if (this.operators.indexOf(item) > -1) {
      this.globalFilterState = 3;
    }
    if (this.seperators.indexOf(item) > -1) {
      this.globalFilterState = 1;
    }
  }

  getHeaders(globalQuery?) {
    const request = { table_name: this.selectedTable.TABLE_NAME, globalQuery };
    if (globalQuery) {
      request.globalQuery = globalQuery;
    }
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
