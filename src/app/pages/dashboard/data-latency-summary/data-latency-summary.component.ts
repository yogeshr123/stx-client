import { Component, OnInit } from '@angular/core';
import { dataLatencySummaryColumns } from '../tableColumns';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MessageService, DialogService } from 'primeng/api';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';

@Component({
  selector: 'app-data-latency-summary',
  templateUrl: './data-latency-summary.component.html',
  styleUrls: ['./data-latency-summary.component.scss'],
  providers: [DialogService]
})
export class DataLatencySummaryComponent implements OnInit {

  selectedColumns = dataLatencySummaryColumns;
  recordsArray: any;
  dataLoader = false;

  constructor(
    public dialogService: DialogService,
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.getLatency();
  }

  getLatency() {
    this.dataLoader = true;
    this.dashboardService.getDataLatency().subscribe((resp: any) => {
      if (resp && !resp.error) {
        if (resp.data.length) {
          const dataLatency = resp.data;
          const createObject = {};
          dataLatency.forEach(element => {
            if (!createObject[element.SCHEMA_NAME]) {
              createObject[element.SCHEMA_NAME] = [];
            }
            const updatedObject = {};
            updatedObject[element.LATENCY_HEADER] = element.TABLE_COUNT;
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
        this.showToast('error', 'Could not get latency data.');
      }
      this.dataLoader = false;
    }, error => {
      this.dataLoader = false;
      this.showToast('error', 'Could not get latency data.');
    });
  }

  showDetails(tableInfo, status, rowData?) {
    const ref = this.dialogService.open(DetailsPopupComponent, {
      header: `Table Details: Schema Name - ${tableInfo.SCHEMA_NAME}`,
      width: '45%',
      data: {
        SCHEMA_NAME: tableInfo.SCHEMA_NAME,
        status,
        latency: true,
        rowData
      }
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
