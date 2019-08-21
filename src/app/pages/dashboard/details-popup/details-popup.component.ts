import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrls: ['./details-popup.component.scss']
})
export class DetailsPopupComponent implements OnInit {

  data: any;
  details: any;
  objectKey = Object.keys;
  dataLoader = false;

  constructor(
    private dashboardService: DashboardService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.data = this.config.data;
    if (this.data.status !== 'SCHEMA_NAME') {
      if (this.data.latency) {
        this.getLatencyDetails();
      } else {
        this.getLoadControlDetails();
      }

    }
  }

  getLatencyDetails() {
    this.dataLoader = true;
    this.dashboardService.getLatencyDetails(this.data).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.details = resp.data;
      }
      this.dataLoader = false;
    });
  }

  getLoadControlDetails() {
    this.dataLoader = true;
    this.dashboardService.getLoadControlDetails(this.data).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.details = resp.data;
      }
      this.dataLoader = false;
    });
  }

}
