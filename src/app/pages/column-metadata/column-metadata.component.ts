import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';

import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';

@Component({
  selector: 'app-column-metadata',
  templateUrl: './column-metadata.component.html',
  styleUrls: ['./column-metadata.component.css'],
  providers: [DialogService]
})
export class ColumnMetadataComponent implements OnInit {

  versions = [];
  showMetaData = false;
  selectedVersion = 1;
  versionData = [];
  loader = {
    columns: true,
    versions: false
  };
  state: any;

  constructor(
    private columnMetadataService: ColumnMetadataService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    // this.showMapping(2);
    this.state = this.columnMetadataService.getState();
    if (this.state.version) {
      this.viewData(this.state.version);
    }
    this.getVersions();
  }

  getVersions() {
    this.loader.versions = true;
    const request = { table_name: 'P250_ERROR_RATE_BY_ZONE_FACT' };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      this.versions = resp.data;
      this.loader.versions = false;
    }, error => {
      this.loader.versions = false;
    });
  }

  viewData(version) {
    this.state.version = version;
    this.selectedVersion = version;
    this.loader.columns = true;
    const request = {
      table_name: 'P250_ERROR_RATE_BY_ZONE_FACT',
      columnVersion: 1
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      this.versionData = resp.data;
      this.loader.columns = false;
      this.showMetaData = true;
    }, error => {
      this.loader.columns = false;
    });
  }

  showMapping(metadataVersion) {
    const ref = this.dialogService.open(MetadataMappingComponent, {
      header: 'Column Version Mapping',
      width: '45%',
      data: metadataVersion
    });
  }

}
