import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/components/table/table';
import { Router } from '@angular/router';

import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { versionTableColumns } from '../tableColumns';
import { CommonService } from 'src/app/services/common.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-all-versions',
  templateUrl: './all-versions.component.html',
  styleUrls: ['./all-versions.component.scss']
})
export class AllVersionsComponent implements OnInit {

  tableColumns = versionTableColumns;
  versionsLoader = false;
  tables: any;
  state: any;
  statusDefaultFilter: any;
  globalQuery: any;
  @ViewChild(Table, { static: false }) tableComponent: Table;
  @ViewChild('statusFilter', { static: false }) statusFilter: ElementRef<HTMLElement>;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private commonService: CommonService,
    private columnMetadataService: ColumnMetadataService
  ) { }

  ngOnInit() {
    this.state = this.commonService.getState();
    this.getAllTables();
  }

  getAllTables() {
    this.versionsLoader = true;
    this.columnMetadataService.getAllTablesInVersions({ queryString: this.globalQuery }).subscribe((resp: any) => {
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
          this.versionsLoader = false;
        }, 0);
      }
    }, error => {
      this.showToast('error', 'Could not get table versions.');
      this.versionsLoader = false;
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

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
