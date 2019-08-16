import { Component, OnInit } from '@angular/core';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import { loadStatusColumns } from '../tableColumns';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MessageService, DialogService } from 'primeng/api';

@Component({
  selector: 'app-loading-status-summary',
  templateUrl: './loading-status-summary.component.html',
  styleUrls: ['./loading-status-summary.component.scss'],
  providers: [DialogService]
})
export class LoadingStatusSummaryComponent implements OnInit {

  selectedColumns = loadStatusColumns;
  recordsArray: any;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getLoadStatus();
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
        }
      } else {
        this.showToast('error', 'Could not get data.');
      }
    }, error => {
      this.showToast('error', 'Could not get data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
