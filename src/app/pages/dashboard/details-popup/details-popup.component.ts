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
  constructor(
    private dashboardService: DashboardService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.data = this.config.data;
    this.getDetails();
  }

  getDetails() {
    this.dashboardService.getLoadControlDetails(this.data).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.details = resp.data;
        console.log("resp.data ", resp.data);
      }
    });
  }

}
