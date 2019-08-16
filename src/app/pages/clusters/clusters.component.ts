import { Component, OnInit } from '@angular/core';
import { ClustersService } from 'src/app/services/clusters.service';

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
    private clustersService: ClustersService
  ) { }

  ngOnInit() {
    this.getClusters();
  }

  editCluster() {

  }

  getClusters() {
    this.clustersService.getClusters().subscribe((resp: any) => {
      this.clustersArray = resp.data;
    }, error => {
      console.log('error ', error);
    });
  }

}
