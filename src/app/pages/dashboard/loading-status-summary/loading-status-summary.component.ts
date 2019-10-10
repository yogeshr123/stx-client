import { Component, OnInit } from '@angular/core';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import { loadStatusColumns, loadingStatusSelectedColumns } from '../tableColumns';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MessageService, DialogService } from 'primeng/api';

@Component({
  selector: 'app-loading-status-summary',
  templateUrl: './loading-status-summary.component.html',
  styleUrls: ['./loading-status-summary.component.scss'],
  providers: [DialogService]
})
export class LoadingStatusSummaryComponent implements OnInit {

  selectedColumns: any;
  allColumns = loadStatusColumns;
  recordsArray: any;
  dataLoader = false;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getLoadStatus();
    if (!localStorage.getItem('loadingStatusSelectedColumns')) {
      this.initColumnState();
    } else {
      // get selected columns from local storage
      this.selectedColumns = JSON.parse(localStorage.getItem('loadingStatusSelectedColumns'));
    }
  }

  saveColumnState() {
    localStorage.setItem('loadingStatusSelectedColumns', JSON.stringify(this.selectedColumns));
  }

  initColumnState() {
    this.selectedColumns = loadingStatusSelectedColumns;
  }

  resetTable() {
    localStorage.removeItem('loadingStatusSelectedColumns');
    this.initColumnState();
  }

  showDetails(tableInfo, status, rowData?) {
    const ref = this.dialogService.open(DetailsPopupComponent, {
      header: `Table Details: Schema Name - ${tableInfo.SCHEMA_NAME}`,
      width: '45%',
      data: {
        SCHEMA_NAME: tableInfo.SCHEMA_NAME,
        status,
        rowData
      }
    });
  }

  getLoadStatus() {
    this.dataLoader = true;
    this.dashboardService.getLoadControlStatus().subscribe((resp: any) => {
      if (resp && !resp.error) {
        if (resp.data.length) {
          const dataLatency = resp.data;
          const createObject = {};
          dataLatency.forEach(element => {
            if (!createObject[element.SCHEMA_NAME]) {
              createObject[element.SCHEMA_NAME] = [];
            }
            const updatedObject = {};
            updatedObject[element.TABLE_STATUS] = element.TABLE_COUNT;
            createObject[element.SCHEMA_NAME].push(updatedObject);
          });
          const dataArray = [];
          for (const key in createObject) {
            if (createObject.hasOwnProperty(key)) {
              const element = createObject[key];
              const dataObject = { SCHEMA_NAME: key };
              element.forEach(innerElement => {
                for (const key2 in innerElement) {
                  if (innerElement.hasOwnProperty(key2)) {
                    if (key2 !== 'SCHEMA_NAME') {
                      dataObject[key2] = innerElement[key2];
                    }
                  }
                }
              });
              dataArray.push(dataObject);
            }
          }
          this.recordsArray = dataArray;
          // To Get Total Records
          const onlyStatusesAll = dataLatency.map(i => i.TABLE_STATUS);
          const onlyStatuses = onlyStatusesAll.filter(this.onlyUniqueFromArray);
          const totalObject = {
            SCHEMA_NAME: 'Total'
          };
          dataLatency.map(i => {
            for (const key in onlyStatuses) {
              if (onlyStatuses.hasOwnProperty(key)) {
                if (i.TABLE_STATUS === onlyStatuses[key]) {
                  if (totalObject[i.TABLE_STATUS]) {
                    totalObject[i.TABLE_STATUS] += i.TABLE_COUNT;
                  } else {
                    totalObject[i.TABLE_STATUS] = i.TABLE_COUNT;
                  }
                }
              }
            }
          });
          this.recordsArray.push(totalObject);
        }
      } else {
        this.showToast('error', 'Could not get data.');
      }
      this.dataLoader = false;
    }, error => {
      this.dataLoader = false;
      this.showToast('error', 'Could not get data.');
    });
  }

  onlyUniqueFromArray(value, index, self) {
    return self.indexOf(value) === index;
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
