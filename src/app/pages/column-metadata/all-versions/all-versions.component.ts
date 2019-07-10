import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/components/table/table';
import { Router } from '@angular/router';

import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { versionTableColumns } from '../tableColumns';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-all-versions',
  templateUrl: './all-versions.component.html',
  styleUrls: ['./all-versions.component.scss']
})
export class AllVersionsComponent implements OnInit {

  tableColumns = versionTableColumns;
  tables: any;
  state: any;
  statusDefaultFilter: any;
  @ViewChild(Table, { static: false }) tableComponent: Table;
  @ViewChild('statusFilter', { static: false }) statusFilter: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private columnMetadataService: ColumnMetadataService
  ) { }

  ngOnInit() {
    this.state = this.commonService.getState();
    this.getAllTables();
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.tables = resp.data;
        this.tables.forEach(element => {
          if (element.STATUS.toLowerCase() === 'new') {
            this.statusDefaultFilter = 'NEW';
          }
        });
        // Trigger New Filter After some Time
        setTimeout(() => {
          this.triggerDefaultFilter();
        }, 0);
      }
    });
  }

  viewDetails(version, redirectRoute) {
    this.state.CMV = { ...this.state.CMV, selectedTable: version };
    this.commonService.setState(this.state);
    this.router.navigate([`/${redirectRoute}`]);

  }

  triggerDefaultFilter() {
    const el: HTMLElement = this.statusFilter.nativeElement;
    const event = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    el.dispatchEvent(event);
  }

}
