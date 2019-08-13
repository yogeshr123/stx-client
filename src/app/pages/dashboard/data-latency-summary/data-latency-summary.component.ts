import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-latency-summary',
  templateUrl: './data-latency-summary.component.html',
  styleUrls: ['./data-latency-summary.component.scss']
})
export class DataLatencySummaryComponent implements OnInit {

  selectedColumns = [
    { field: 'SCHEMA_NAME' },
    { field: 'Current' },
    { field: 'Data < 1 Week' },
    { field: 'Data < 2 Week' },
    { field: 'Data < 3 Week' },
    { field: 'Data < 4 Week' },
    { field: 'Data < 8 Week' },
    { field: 'Data <=13 Week' },
    { field: 'Data <=18 Week' },
    { field: 'Data <=26 Week' },
  ];
  recordsArray = [
    {
      SCHEMA_NAME: 'ATHENA',
      Current: '1',
      'Data < 1 Week': '',
      'Data < 2 Week': '',
      'Data < 3 Week': '',
      'Data < 4 Week': '3',
      'Data < 8 Week': '',
      'Data <=13 Week': '',
      'Data <=18 Week': '',
      'Data <=26 Week': '2',
    },
    {
      SCHEMA_NAME: 'DIM',
      Current: '',
      'Data < 1 Week': '',
      'Data < 2 Week': '4',
      'Data < 3 Week': '',
      'Data < 4 Week': '',
      'Data < 8 Week': '',
      'Data <=13 Week': '7',
      'Data <=18 Week': '',
      'Data <=26 Week': '',
    },
    {
      SCHEMA_NAME: 'DRIVE',
      Current: '118',
      'Data < 1 Week': '5',
      'Data < 2 Week': '4',
      'Data < 3 Week': '35',
      'Data < 4 Week': '7',
      'Data < 8 Week': '9',
      'Data <=13 Week': '7',
      'Data <=18 Week': '13',
      'Data <=26 Week': '5',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
