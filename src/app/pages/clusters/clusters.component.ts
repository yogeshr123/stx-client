import { Component, OnInit } from '@angular/core';
import { ClustersService } from 'src/app/services/clusters.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})
export class ClustersComponent implements OnInit {

  selectedColumns = [
    { field: 'CLUSTER_ID' },
    { field: 'ENV_NAME' },
    { field: 'CLUSTER_FOR' },
    { field: 'MASTER_IP_ADD' },
    { field: 'LIVY_URL' },
    { field: 'YARN_URL' },
    { field: 'SPARK_URL' },
    { field: 'GANGLIA_URL' },
    { field: 'SPARK_SCRIPT_PATH' },
    { field: 'UPDATE_DATE', type: 'date' },
    { field: 'UPDATED_BY' },
  ];
  clustersArray = [];

  constructor(
    private router: Router,
    private clustersService: ClustersService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.getClusters();
  }

  editCluster(cluster, isEdit) {
    let appState = this.commonService.getState();
    appState = { ...appState, selectedCluster: cluster };
    this.commonService.setState(appState);
    if (isEdit) {
      return this.router.navigate(['clusters/edit-cluster']);
    } else {
      return this.router.navigate(['clusters/view-cluster']);
    }
  }

  getClusters() {
    this.clustersService.getClusters().subscribe((resp: any) => {
      this.clustersArray = resp.data;
    }, error => {
      console.log('error ', error);
    });
  }

}
