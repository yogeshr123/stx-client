import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderHashService } from 'src/app/services/header-hash.service';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';

import { columnTableColumns } from './tableColumns';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { CommonService } from 'src/app/services/common.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-header-hash',
  templateUrl: './header-hash.component.html',
  styleUrls: ['./header-hash.component.scss']
})
export class HeaderHashComponent implements OnInit {

  headers: any;
  selectedColumns: any;
  selectedTable: any;
  fileHeaderHashErrorTableData: any;
  uniqueTables: any;
  uniqueTablesBackUp: any;
  columnTableColumns = columnTableColumns;
  state: any;
  dataLoader = false;
  showMismatchToggle = true;
  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private messageService: MessageService,
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
    this.fileHeaderHashErrorTable();
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

  fileHeaderHashErrorTable() {
    this.headerHashService.fileHeaderHashErrorTable().subscribe((res: any) => {
      const allTables = res.data;
      this.fileHeaderHashErrorTableData = this.removeDuplicates(allTables, 'TABLE_NAME');
    }, error => {
      console.error('error ', error);
    });
  }

  toggleTablesList() {
    if (this.showMismatchToggle) {
      this.uniqueTables = this.uniqueTablesBackUp;
    } else {
      this.uniqueTables = this.fileHeaderHashErrorTableData;
    }
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions({ queryString: '' }).subscribe((res: any) => {
      const allTables = res.data;
      this.uniqueTables = this.removeDuplicates(allTables, 'TABLE_NAME');
      this.uniqueTablesBackUp = JSON.parse(JSON.stringify(this.uniqueTables));
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

  getHeaders(globalQuery?) {
    this.dataLoader = true;
    const request = { table_name: this.selectedTable.TABLE_NAME, globalQuery };
    if (globalQuery) {
      request.globalQuery = globalQuery;
    }
    this.headerHashService.getHeaders(request).subscribe((res: any) => {
      this.headers = res.data;
      this.dataLoader = false;
    }, error => {
      this.dataLoader = false;
      this.showToast('error', 'Could not get data.');
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }

}
