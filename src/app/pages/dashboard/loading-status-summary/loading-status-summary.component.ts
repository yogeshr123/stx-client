import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-status-summary',
  templateUrl: './loading-status-summary.component.html',
  styleUrls: ['./loading-status-summary.component.scss']
})
export class LoadingStatusSummaryComponent implements OnInit {

  selectedColumns = [
    { field: 'Fully Loading' },
    { field: 'Error Hold' },
    { field: 'Hold All Processes' },
    { field: 'Hold Tier 2/3' },
    { field: 'Hold Table DDL Needed' },
    { field: 'Low Priority Table On Hold' },
    { field: 'No Data Feed' },
    { field: 'Grand Total' }
  ];
  recordsArray = [
    {
      'Fully Loading': 'ATHENA',
      'Error Hold': '1',
      'Hold All Processes': '',
      'Hold Tier 2/3': '',
      'Hold Table DDL Needed': '',
      'Low Priority Table On Hold': '3',
      'No Data Feed': '',
      'Grand Total': ''
    },
    {
      'Fully Loading': 'DIM',
      'Error Hold': '',
      'Hold All Processes': '',
      'Hold Tier 2/3': '4',
      'Hold Table DDL Needed': '',
      'Low Priority Table On Hold': '',
      'No Data Feed': '',
      'Grand Total': '7'
    },
    {
      'Fully Loading': 'DRIVE',
      'Error Hold': '118',
      'Hold All Processes': '5',
      'Hold Tier 2/3': '4',
      'Hold Table DDL Needed': '35',
      'Low Priority Table On Hold': '7',
      'No Data Feed': '9',
      'Grand Total': '7'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
