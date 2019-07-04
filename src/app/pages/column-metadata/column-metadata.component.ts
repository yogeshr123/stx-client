import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';

import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { CommonService } from 'src/app/services/common.service';
import { versionTableColumns } from './tableColumns';

@Component({
  selector: 'app-column-metadata',
  templateUrl: './column-metadata.component.html',
  styleUrls: ['./column-metadata.component.css'],
  providers: [DialogService]
})
export class ColumnMetadataComponent implements OnInit {

  versions = [];
  showMetaData = false;
  selectedVersion: any;
  versionData = [];
  loader = {
    columns: false,
    versions: false,
    tabs: false
  };
  state: any;
  tables: any;
  uniqueTables: any;
  showGenerateVersion = true;
  selectedTable = 'P250_ERROR_RATE_BY_ZONE_FACT';
  tableColumns = versionTableColumns;
  activeTab = 0;

  constructor(
    private columnMetadataService: ColumnMetadataService,
    private commonService: CommonService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getVersions();
    this.getAllTables();
    this.state = this.commonService.getState();
  }

  checkStateUpdateSelectedTable() {
    this.loader.tabs = true;
    if (this.state.CMV && this.state.CMV.activeTab) {
      this.activeTab = this.state.CMV.activeTab;
    }
    if (this.state.CMV && this.state.CMV.version) {
      const selectedVersion = this.versions.filter(i => i.METADATA_VERSION === this.state.CMV.version);
      this.viewData(selectedVersion[0]);
    }
    this.loader.tabs = false;
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.tables = resp.data;
        this.uniqueTables = this.removeDuplicates(resp.data, 'TABLE_NAME');
      }
    }, error => { });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getVersions() {
    this.loader.versions = true;
    const request = { table_name: this.selectedTable };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      this.versions = resp.data;
      this.loader.versions = false;
      this.checkStateUpdateSelectedTable();
      this.versions.forEach(element => {
        if (element.STATUS.toLowerCase() === 'new') {
          this.showGenerateVersion = false;
        }
      });
    }, error => {
      console.log('error getVersions', error);
      this.loader.versions = false;
    });
  }

  viewData(version) {
    this.state.CMV = { ...this.state.CMV, version: version.METADATA_VERSION };
    this.commonService.setState(this.state);
    this.selectedVersion = version;
    this.loader.columns = true;
    const request = {
      table_name: this.selectedTable,
      columnVersion: 1
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      this.versionData = resp.data;
      this.loader.columns = false;
      this.showMetaData = true;
    }, error => {
      console.log('error viewData', error);
      this.loader.columns = false;
    });
  }

  generateNewVersion() {
    const allVersions = [];
    this.versions.forEach(element => {
      allVersions.push(element.METADATA_VERSION);
    });
    console.log(Math.max(...allVersions));
  }

  showMapping(metadataVersion) {
    const ref = this.dialogService.open(MetadataMappingComponent, {
      header: 'Column Version Mapping',
      width: '45%',
      data: metadataVersion
    });
  }

  tabChanged(event) {
    this.activeTab = event.index;
    this.state.CMV = { ...this.state.CMV, activeTab: this.activeTab };
    this.commonService.setState(this.state);
  }

}
