import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';

import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { CommonService } from 'src/app/services/common.service';
import { versionTableColumns, columnTableColumns } from './tableColumns';

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
  selectedTableName: any;
  showGenerateVersion = true;
  selectedTable: any;
  tableColumns = versionTableColumns;
  columnTableColumns = columnTableColumns;
  activeTab = 0;

  selectedColumns = [
    {
      header: 'TARGET COLUMN ID',
      field: 'TARGET_COLUMN_ID'
    },
    {
      header: 'SRC COLUMN NAME',
      field: 'SRC_COLUMN_NAME'
    },
    {
      header: 'SRC COLUMN TYPE',
      field: 'SRC_COLUMN_TYPE'
    },
    {
      header: 'SRC DATA TYPE',
      field: 'SRC_DATA_TYPE'
    },
    {
      header: 'TARGET COLUMN NAME',
      field: 'TARGET_COLUMN_NAME'
    },
    {
      header: 'TARGET DATA TYPE',
      field: 'TARGET_DATA_TYPE'
    },
    {
      header: 'PRIMARY KEY',
      field: 'IS_PKEY_COLUMN'
    },
    {
      header: 'DATE UPDATED',
      field: 'UPDATE_DATE'
    }];

  constructor(
    private columnMetadataService: ColumnMetadataService,
    private commonService: CommonService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getAllTables();
    this.state = this.commonService.getState();
    if (this.state.CMV && this.state.CMV.selectedTable) {
      this.selectedTable = this.state.CMV.selectedTable;
      this.getVersions();
    }
  }

  checkStateUpdateSelectedTable() {
    this.loader.tabs = true;
    if (this.state.CMV && this.state.CMV.activeTab) {
      this.activeTab = this.state.CMV.activeTab;
    }
    if (this.state.CMV && this.state.CMV.selectedTable) {
      const selectedVersion = this.versions.filter(i => i.METADATA_VERSION === this.state.CMV.selectedTable.METADATA_VERSION);
      if (selectedVersion && selectedVersion.length) {
        this.viewData(selectedVersion[0]);
      }
    }
    this.loader.tabs = false;
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.tables = resp.data;
        this.uniqueTables = this.removeDuplicates(resp.data, 'TABLE_NAME');
        if (!this.state.CMV || this.state.CMV.selectedTable) {
          this.selectedTable = this.uniqueTables[0];
          this.viewData(this.selectedTable);
          this.getVersions();
        }
      }
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getVersions() {
    this.loader.versions = true;
    const request = { table_name: this.selectedTable.TABLE_NAME };
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
      this.loader.versions = false;
    });
  }

  viewDetails(version) {
    const selectedTableName = this.uniqueTables.filter(i => i.TABLE_NAME === version.TABLE_NAME);
    if (selectedTableName && selectedTableName.length) {
      this.selectedTableName = selectedTableName[0];
    }
    this.selectedTable = version;
    this.state.CMV = { ...this.state.CMV, selectedTable: version };
    this.tabChanged({ index: 1 });
    this.getVersions();
  }

  viewData(version) {
    this.state.CMV = { ...this.state.CMV, selectedTable: version };
    this.commonService.setState(this.state);
    this.selectedVersion = version;
    this.loader.columns = true;
    const request = {
      table_name: this.selectedTable.TABLE_NAME,
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
