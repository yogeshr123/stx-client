import { Component, OnInit } from '@angular/core';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { MessageService, DialogService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { EmailConfigService } from 'src/app/services/email-config.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})
export class EmailConfigComponent implements OnInit {

  emailConfig: any[];
  selectedSparkConfig: any;
  emailConfigColumns: any;
  appState: any;

  constructor(
    private emailConfigService: EmailConfigService,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.appState = this.commonService.getState();
    this.emailConfigColumns = [
      {
        header: 'EMAIL_GROUP',
        field: 'EMAIL_GROUP'
      },
      {
        header: 'EMAIL_ADDRESSES',
        field: 'EMAIL_ADDRESSES'
      },
      {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
        type: 'date'
      },
      {
        header: 'UPDATED_BY',
        field: 'UPDATED_BY',
      }
    ];

    this.loadSparkConfig();
  }

  loadSparkConfig() {
    this.emailConfigService.getSparkConfig().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.emailConfig = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  selectSparkConfig(emailConfig: any, edit: boolean) {
    this.appState = { ...this.appState, selectedSparkConfig: emailConfig };
    this.commonService.setState(this.appState);
    if (edit) {
      this.router.navigate(['email-config/edit']);
    } else {
      this.router.navigate(['email-config/view']);
    }
  }

}
