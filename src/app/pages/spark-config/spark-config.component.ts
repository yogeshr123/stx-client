import { Component, OnInit } from '@angular/core';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { MessageService, DialogService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { SparkConfigService } from 'src/app/services/spark-config.service';
@Component({
  selector: 'app-spark-config',
  templateUrl: './spark-config.component.html',
  styleUrls: ['./spark-config.component.scss']
})
export class SparkConfigComponent implements OnInit {

  sparkConfig: any[];
  selectedSparkConfig: any;
  sparkConfigColumns: any;
  appState: any;

  constructor(
    private sparkConfigService: SparkConfigService,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.appState = this.commonService.getState();
    this.sparkConfigColumns = [
      {
        header: 'SCHEMA_NAME',
        field: 'SCHEMA_NAME'
      },
      {
        header: 'TABLE_NAME',
        field: 'TABLE_NAME'
      },
      {
        header: 'ENV_NAME',
        field: 'ENV_NAME'
      },
      {
        header: 'LOAD_TYPE',
        field: 'LOAD_TYPE'
      },
      {
        header: 'SPARK_CONF',
        field: 'SPARK_CONF'
      },
      {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
      },
      {
        header: 'UPDATED_BY',
        field: 'UPDATED_BY',
      }
    ];

    this.loadSparkConfig();
  }

  loadSparkConfig() {
    this.sparkConfigService.getSparkConfig().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.sparkConfig = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  selectSparkConfig(sparkConfig: any, edit: boolean) {
    this.appState = { ...this.appState, selectedSparkConfig: sparkConfig };
    this.commonService.setState(this.appState);
    if (edit) {
      this.router.navigate(['spark-config/edit']);
    }
    else {
      this.router.navigate(['spark-config/view']);
    }
  }
}
