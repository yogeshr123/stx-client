import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadControlService } from '../../services/load-control.service';
import { NavigationExtras, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';

export interface Car {
  TABLE_NAME?;
  ENV_NAME?;
  TARGET_SCHEMA_NAME?;
  color?;
  price?;
  saleDate?;
}

@Component({
  selector: 'app-loadcontrol',
  templateUrl: './load-control.component.html',
  styles: []
})
export class LoadControlComponent implements OnInit {

  recordsArray: any[];
  ENV_NAME: any[];
  totalcols: any[];
  initialBinding = true;

  selectedRecords: any[];
  selectedColumns: any[];
  globalQuery: string;

  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private loadControlService: LoadControlService,
    private recordService: RecordService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
  }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService', sticky: true });
  }

  ngOnInit() {
    this.loadAllRecords();

    this.ENV_NAME = [
      { label: 'PRD', value: 'PRD' },
      { label: 'DEV', value: 'DEV' },
      { label: 'QA', value: 'QA' }
    ];
    if (!localStorage.getItem('selectedColumns')) {
      this.initColumnState();
    } else {
      // get selected columns from local storage
      this.selectedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
    }
  }

  loadAllRecords() {
    this.loadControlService.getRecords().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordsArray = data.data;
        this.totalcols = [];
        for (var key in this.recordsArray[0]) {
          this.totalcols.push({ field: key });
        }
      }
    });
  }

  saveColumnState() {
    localStorage.setItem('selectedColumns', JSON.stringify(this.selectedColumns));
    this.resetFilters();
  }

  initColumnState() {
    this.selectedColumns = [
      { field: 'SCHEMA_NAME' },
      { field: 'TABLE_NAME' },
      { field: 'ENV_NAME' },
      { field: 'TARGET_SCHEMA_NAME' },
    ];
  }

  resetTable() {
    const statefilter = JSON.parse(localStorage.getItem('statedemo-local'));
    if (statefilter) {
      localStorage.removeItem('statedemo-local');
    }
    const columnState = JSON.parse(localStorage.getItem('selectedColumns'));
    if (columnState) {
      localStorage.removeItem('selectedColumns');
      this.initColumnState();
    }
    this.tableComponent.reset();
  }

  resetFilters() {
    const statefilter = JSON.parse(localStorage.getItem('statedemo-local'));
    if (statefilter) {
      localStorage.removeItem('statedemo-local');
    }
    this.tableComponent.reset();
  }

  onRowEdit(row: any) {
    this.recordService.changeActiveRecord(row);
    this.router.navigate(['/loadcontrol/edit']);
  }

  onStateSave(event: any) {
    console.log(event);
  }

  changeETLStatus(status: string) {
    // if (this.selectedRecords.length > 0) {
    //   let records = [];
    //   for (var _i = 0; _i < this.selectedRecords.length; _i++) {
    //     records.push({
    //       SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
    //       TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
    //       ENV_NAME: this.selectedRecords[_i].ENV_NAME,
    //     })
    //   }
    //   const body = {
    //     ETL_STATUS: status,
    //     records: records
    //   };

    //   this.loadControlService.changeETLStatus(body).subscribe((data: any) => {
    //     console.log(data);
    //     this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
    //   });
    // }
    this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
  }


  search() {
    // if (undefined != this.globalQuery && null != this.globalQuery && this.globalQuery != "") {
    //   const body = {
    //     query: this.globalQuery
    //   };
    //   this.fetchData(body);
    // }
    // else {
    //   this.loadAllRecords();
    // }
  }

  confirmAction(message: string, functionName: string, action: string) {
    if (this.selectedRecords && this.selectedRecords.length > 0) {
      this.confirmationService.confirm({
        message: `Do you want to ${message}?`,
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          if (functionName == 'changeETLStatus') {
            this.changeETLStatus(action);
          }
        },
        reject: () => {
        }
      });
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Please select records first', life: 3000 });
    }
  }
}





