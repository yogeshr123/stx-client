import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import { loadStatusColumns } from '../tableColumns';

@Component({
  selector: 'app-loading-status-summary',
  templateUrl: './loading-status-summary.component.html',
  styleUrls: ['./loading-status-summary.component.scss'],
  providers: [DialogService]
})
export class LoadingStatusSummaryComponent implements OnInit {

  selectedColumns = loadStatusColumns;
  recordsArray = [
    {
      SCHEMA_NAME: 'ATHENA',
      'Fully Loading': '',
      'Error Hold': '1',
      'Hold All Processes': '',
      'Hold Tier 2/3': '',
      'Hold Table DDL Needed': '',
      'Low Priority Table On Hold': '3',
      'No Data Feed': '',
      'Grand Total': ''
    },
    {
      SCHEMA_NAME: 'DIM',
      'Fully Loading': '2',
      'Error Hold': '',
      'Hold All Processes': '',
      'Hold Tier 2/3': '4',
      'Hold Table DDL Needed': '',
      'Low Priority Table On Hold': '',
      'No Data Feed': '',
      'Grand Total': '7'
    },
    {
      SCHEMA_NAME: 'DRIVE',
      'Fully Loading': '12',
      'Error Hold': '118',
      'Hold All Processes': '5',
      'Hold Tier 2/3': '4',
      'Hold Table DDL Needed': '35',
      'Low Priority Table On Hold': '7',
      'No Data Feed': '9',
      'Grand Total': '7'
    }
  ];

  constructor(
    public dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  showDetails(tableInfo, status) {
    const ref = this.dialogService.open(DetailsPopupComponent, {
      header: `Table Details: Schema Name - ${tableInfo.SCHEMA_NAME}`,
      width: '45%',
      data: {
        SCHEMA_NAME: tableInfo.SCHEMA_NAME,
        status
      }
    });
  }

}
