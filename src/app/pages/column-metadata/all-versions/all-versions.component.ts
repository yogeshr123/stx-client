import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/components/table/table';

import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { versionTableColumns } from '../tableColumns';

@Component({
  selector: 'app-all-versions',
  templateUrl: './all-versions.component.html',
  styleUrls: ['./all-versions.component.scss']
})
export class AllVersionsComponent implements OnInit {

  tableColumns = versionTableColumns;
  tables: any;
  statusDefaultFilter = 'NEW';
  @ViewChild(Table, { static: false }) tableComponent: Table;
  @ViewChild('statusFilter', { static: false }) statusFilter: ElementRef<HTMLElement>;

  constructor(
    private columnMetadataService: ColumnMetadataService
  ) { }

  ngOnInit() {
    this.getAllTables();
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.tables = resp.data;
        this.triggerDefaultFilter();
      }
    });
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
