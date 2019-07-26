import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';
import { MessageService } from 'primeng/api';

import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { CommonService } from 'src/app/services/common.service';
import { columnTableColumns, versionTableColumns } from './tableColumns';
import { Router } from '@angular/router';


@Component({
  selector: 'app-column-metadata',
  templateUrl: './column-metadata.component.html',
  styleUrls: ['./column-metadata.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ColumnMetadataComponent implements OnInit {

  versions = [];
  showMetaData = false;
  selectedVersion: any;
  versionData = [];
  loader = {
    columns: false,
    versions: false,
    delete: false,
    save: false
  };
  state: any;
  uniqueTables: any;
  selectedTableName: any;
  showGenerateVersion = true;
  isFirstNewVersion: any = null;
  selectedTable: any;
  columnTableColumns = columnTableColumns;
  versionTableColumns = versionTableColumns;
  @ViewChild(Table, { static: false }) tableComponent: Table;
  selectedColumns: any;
  errors: any = {
    hasError: false
  };
  enableSaveChanges = false;
  tableLoadStrategy: any;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
    this.getSelectedColumns();
  }

  getSelectedColumns() {
    if (!localStorage.getItem('selectedVersionColumns')) {
      this.initColumnState();
    } else {
      this.selectedColumns = JSON.parse(localStorage.getItem('selectedVersionColumns'));
    }
  }

  saveColumnState() {
    localStorage.setItem('selectedVersionColumns', JSON.stringify(this.selectedColumns));
    this.resetFilters();
  }

  resetFilters() {
    const statefilter = JSON.parse(localStorage.getItem('stateSelectedVersionColumns'));
    if (statefilter) {
      localStorage.removeItem('stateSelectedVersionColumns');
    }
    this.tableComponent.reset();
  }

  initColumnState() {
    this.selectedColumns = columnTableColumns;
  }

  checkStateUpdateSelectedTable() {
    if (this.state.CMV && this.state.CMV.selectedTable) {
      const selectedVersion = this.versions.filter(i => i.METADATA_VERSION === this.state.CMV.selectedTable.METADATA_VERSION);
      if (selectedVersion && selectedVersion.length) {
        this.viewData(selectedVersion[0]);
      }
    }
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.uniqueTables = this.removeDuplicates(resp.data, 'TABLE_NAME');
        if (!this.state.CMV || !this.state.CMV.selectedTable) {
          this.selectedTable = this.uniqueTables[0];
          this.viewData(this.selectedTable);
          this.getVersions();
        } else {
          const selectedTableName = this.uniqueTables.filter(i => i.TABLE_NAME === this.state.CMV.selectedTable.TABLE_NAME);
          if (selectedTableName && selectedTableName.length) {
            this.selectedTableName = selectedTableName[0];
          }
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
    this.isFirstNewVersion = null;
    this.showGenerateVersion = true;
    this.loader.versions = true;
    const request = { table_name: this.selectedTable.TABLE_NAME };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      this.versions = resp.data;
      this.loader.versions = false;
      this.checkStateUpdateSelectedTable();
      this.versions.forEach((element, index) => {
        if (element.STATUS.toLowerCase() === 'new') {
          this.showGenerateVersion = false;
          if (!this.isFirstNewVersion) {
            this.isFirstNewVersion = index;
          }
        }
      });
    }, error => {
      this.loader.versions = false;
    });

    this.columnMetadataService.getTableInfoFromLoadControl({ table: this.selectedTable }).subscribe((resp: any) => {
      if (!resp.error && resp.data && resp.data.length) {
        this.tableLoadStrategy = resp.data[0].LOAD_STRATEGY;
      }
    });
  }

  changeTable() {
    this.errors.hasError = false;
    this.state.CMV = { ...this.state.CMV, selectedTable: this.selectedTableName };
    this.commonService.setState(this.state);
    this.ngOnInit();
    this.enableSaveChanges = false;
  }

  reOrderByUpdateDate() {
    this.versionData = this.versionData.sort((a, b) => {
      return +new Date(b.UPDATE_DATE) - +new Date(a.UPDATE_DATE);
    });
  }

  viewData(version) {
    this.versionData = [];
    this.state.CMV = { ...this.state.CMV, selectedTable: version };
    this.commonService.setState(this.state);
    this.selectedVersion = version;
    this.loader.columns = true;
    const request = {
      table_name: this.selectedTable.TABLE_NAME,
      columnVersion: version.METADATA_VERSION
    };
    let localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
    let key;
    if (localCopyOfVersion) {
      key = localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`];
    }
    if (!localCopyOfVersion || !key || version.STATUS !== 'NEW') {
      this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
        this.versionData = resp.data;
        this.loader.columns = false;
        this.showMetaData = true;
        if (version.STATUS === 'NEW') {
          localCopyOfVersion = {
            [`${version.METADATA_VERSION}_${version.TABLE_NAME}`]: this.versionData
          };
          this.columnMetadataService.setLocalCopyOfVersion(localCopyOfVersion);
        }
      }, error => {
        this.loader.columns = false;
      });
    } else {
      this.versionData = localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`];
      this.showMetaData = true;
      this.loader.columns = false;
    }
    if (this.versionData && this.versionData.length) {
      this.enableSaveChanges = false;
      this.versionData.map(i => {
        if (i.action) {
          this.enableSaveChanges = true;
        }
      });
    }
    this.reOrderByUpdateDate();
  }

  deleteColumn(version) {
    if (version.action === 'deleted') {
      this.confirmationService.confirm({
        message: 'Would you like to undo delete?',
        accept: () => {
          this.loader.delete = true;
          const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
          localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`] =
            localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`]
              .map(i => {
                if (i.TARGET_COLUMN_ID === version.TARGET_COLUMN_ID) {
                  i.UPDATE_DATE = i.oldUpdateDate;
                  delete i.action;
                }
                return i;
              });
          this.columnMetadataService.setLocalCopyOfVersion(localCopyOfVersion);
          this.loader.delete = false;
          this.ngOnInit();
        }
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this column?',
        accept: () => {
          this.loader.delete = true;
          const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
          localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`] =
            localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`]
              .map(i => {
                if (!i.TARGET_COLUMN_ID && version.action === 'newColumn') {
                  return undefined;
                } else if (i.TARGET_COLUMN_ID === version.TARGET_COLUMN_ID) {
                  i.oldUpdateDate = i.UPDATE_DATE;
                  i.UPDATE_DATE = new Date();
                  i.action = 'deleted';
                }
                return i;
              });
          localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`] =
            localCopyOfVersion[`${version.METADATA_VERSION}_${version.TABLE_NAME}`]
              .filter(i => i !== undefined);
          this.columnMetadataService.setLocalCopyOfVersion(localCopyOfVersion);
          this.loader.delete = false;
          this.ngOnInit();
        }
      });
    }
    if (this.versionData && this.versionData.length) {
      this.enableSaveChanges = false;
      this.versionData.map(i => {
        if (i.action) {
          this.enableSaveChanges = true;
        }
      });
    }
  }

  editColumn(version, isView?) {
    this.columnMetadataService.setColumnToEdit(version);
    if (isView) {
      return this.router.navigate(['/CMV/view-column', version.METADATA_VERSION, version.TARGET_COLUMN_ID || 'new']);
    }
    return this.router.navigate(['/CMV/edit-column', version.METADATA_VERSION, version.TARGET_COLUMN_ID || 'new']);
  }

  validate(version) {
    this.columnMetadataService.validateVersion({ version }).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Version Validated!');
        this.isFirstNewVersion = null;
        this.ngOnInit();
      } else {
        this.showToast('error', 'Could not validate version.');
      }
    }, error => {
      this.showToast('error', 'Could not validate version.');
    });
  }

  checkForDuplicatesInArray(array) {
    const uniq = array
      .map((name) => {
        return {
          count: 1,
          name
        };
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
      }, {});
    let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    // tslint:disable-next-line:triple-equals
    duplicates = duplicates.filter(i => i != 'undefined');
    return duplicates;
  }

  search(globalQuery) {
    console.log('globalQuery ', globalQuery);
    // this.viewData(this.selectedTable);
  }

  saveChanges(isValidate?, version?) {
    this.errors = {
      hasError: false
    };
    // Check CMV Validations
    const localCopyOfVersion = this.columnMetadataService.getLocalCopyOfVersion();
    const colums = localCopyOfVersion[this.selectedVersion.METADATA_VERSION + '_' + this.selectedVersion.TABLE_NAME];
    // Check Unique Target Target Column Name
    const targetColumnNames = colums.map(i => i.TARGET_COLUMN_NAME);
    const checkDuplicatetTargetNames = this.checkForDuplicatesInArray(targetColumnNames);
    if (checkDuplicatetTargetNames && checkDuplicatetTargetNames.length) {
      this.errors.hasError = true;
      this.errors.duplicatetTargetNames = checkDuplicatetTargetNames;
    }
    // Check Unique Combination of SRC_COLUMN_NAME & LOOKUP_TABLE_ALIAS
    const srcAndTableAlias = colums.map(i => {
      if (i.LOOKUP_TABLE_ALIAS) {
        return `${i.SRC_COLUMN_NAME}+${i.LOOKUP_TABLE_ALIAS ? i.LOOKUP_TABLE_ALIAS : ''}`;
      }
    });
    const checkSrcAndTableAlias = this.checkForDuplicatesInArray(srcAndTableAlias);
    if (checkSrcAndTableAlias && checkSrcAndTableAlias.length) {
      this.errors.hasError = true;
      this.errors.checkSrcAndTableAlias = checkSrcAndTableAlias;
    }
    // Check IS_PARTITION_COLUMN should be only 1
    let isPartitionColumn = colums.map(i => {
      if (i.IS_PARTITION_COLUMN === 1 ||
        i.IS_PARTITION_COLUMN === true || (i.IS_PARTITION_COLUMN && i.IS_PARTITION_COLUMN.data && i.IS_PARTITION_COLUMN.data[0])) {
        return i.SRC_COLUMN_NAME;
      }
    });
    isPartitionColumn = isPartitionColumn.filter(i => i !== undefined);
    if (isPartitionColumn && isPartitionColumn.length > 1) {
      this.errors.hasError = true;
      this.errors.isPartitionColumn = isPartitionColumn;
    }
    // Partition Column Should have TARGET_DATA_TYPE as varchar
    let isPartitionColumn2 = colums.map(i => {
      if (i.IS_PARTITION_COLUMN === 1 ||
        i.IS_PARTITION_COLUMN === true || (i.IS_PARTITION_COLUMN && i.IS_PARTITION_COLUMN.data && i.IS_PARTITION_COLUMN.data[0])) {
        return `${i.SRC_COLUMN_NAME}+${i.TARGET_DATA_TYPE}`;
      }
    });
    isPartitionColumn2 = isPartitionColumn2.filter(i => i !== undefined);
    isPartitionColumn2 = isPartitionColumn2.map(i => {
      const checkDataType = i.split('+')[1];
      if (!/^int|varchar/g.test(checkDataType)) {
        return i.split('+')[0];
      }
    });
    isPartitionColumn2 = isPartitionColumn2.filter(i => i !== undefined);
    if (isPartitionColumn2 && isPartitionColumn2.length) {
      this.errors.hasError = true;
      this.errors.isPartitionColumnDataType = isPartitionColumn2;
    }
    // Check IS_UPDATE_DATE_COLUMN should be only 1
    let isUpdateDateColumn = colums.map(i => {
      if (i.IS_UPDATE_DATE_COLUMN === 1 ||
        i.IS_UPDATE_DATE_COLUMN === true || (i.IS_UPDATE_DATE_COLUMN && i.IS_UPDATE_DATE_COLUMN.data && i.IS_UPDATE_DATE_COLUMN.data[0])) {
        return i.SRC_COLUMN_NAME;
      }
    });
    isUpdateDateColumn = isUpdateDateColumn.filter(i => i !== undefined);
    if (isUpdateDateColumn && isUpdateDateColumn.length && isUpdateDateColumn.length > 1) {
      this.errors.hasError = true;
      this.errors.isUpdateDateColumn = isUpdateDateColumn;
    }
    // Check Load Strategy Validations
    const hasPartition = [];
    const hadUpdateDate = [];
    const hasPrimaryKey = [];
    if (this.tableLoadStrategy && this.tableLoadStrategy.toLowerCase() === 'sampled') {
      colums.map(i => {
        if (i.IS_UPDATE_DATE_COLUMN === 1 ||
          i.IS_UPDATE_DATE_COLUMN === true ||
          (i.IS_UPDATE_DATE_COLUMN && i.IS_UPDATE_DATE_COLUMN.data && i.IS_UPDATE_DATE_COLUMN.data[0])) {
          hadUpdateDate.push(i);
        }
        if (i.IS_PARTITION_COLUMN === 1 ||
          i.IS_PARTITION_COLUMN === true ||
          (i.IS_PARTITION_COLUMN && i.IS_PARTITION_COLUMN.data && i.IS_PARTITION_COLUMN.data[0])) {
          hasPartition.push(i);
        }
        if (i.IS_PKEY_COLUMN === 1 ||
          i.IS_PKEY_COLUMN === true ||
          (i.IS_PKEY_COLUMN && i.IS_PKEY_COLUMN.data && i.IS_PKEY_COLUMN.data[0])) {
          hasPrimaryKey.push(i);
        }
        return i;
      });
      if (!hasPartition.length || !hadUpdateDate.length || !hasPrimaryKey.length) {
        this.errors.hasError = true;
        this.errors.loadStrategyErrorMsg =
          '- For Load Strategy SAMPLED table: there must be atleast 1 IS_PARTITION_COLUMN, IS_PKEY_COLUMN & IS_UPDATE_DATE_COLUMN.';
      }
    }
    if (this.tableLoadStrategy && this.tableLoadStrategy.toLowerCase() === 'insert') {
      colums.map(i => {
        if (i.IS_PARTITION_COLUMN === 1 ||
          i.IS_PARTITION_COLUMN === true ||
          (i.IS_PARTITION_COLUMN && i.IS_PARTITION_COLUMN.data && i.IS_PARTITION_COLUMN.data[0])) {
          hasPartition.push(i);
        }
        return i;
      });
      if (!hasPartition.length) {
        this.errors.hasError = true;
        this.errors.loadStrategyErrorMsg =
          '- For Load Strategy INSERT table: there must be atleast 1 IS_PARTITION_COLUMN.';
      }
    }
    if (this.tableLoadStrategy && this.tableLoadStrategy.toLowerCase() === 'refresh') {
      colums.map(i => {
        if (i.IS_PARTITION_COLUMN === 1 ||
          i.IS_PARTITION_COLUMN === true ||
          (i.IS_PARTITION_COLUMN && i.IS_PARTITION_COLUMN.data && i.IS_PARTITION_COLUMN.data[0])) {
          hasPartition.push(i);
        }
        return i;
      });
      if (hasPartition.length) {
        this.errors.hasError = true;
        this.errors.loadStrategyErrorMsg =
          '- For Load Strategy REFRESH table: there should not be IS_PARTITION_COLUMN.';
      }
    }

    if (!this.errors.hasError) {
      if (isValidate) {
        this.validate(version);
      } else {
        this.saveMasterData(localCopyOfVersion);
      }
    } else {
      this.showMapping(this.errors);
    }
  }

  saveMasterData(localCopyOfVersion) {
    this.loader.save = true;
    const colums = localCopyOfVersion[this.selectedVersion.METADATA_VERSION + '_' + this.selectedVersion.TABLE_NAME];
    const addColumns = colums.filter(i => i.action === 'newColumn');
    const updateColumns = colums.filter(i => i.action === 'updatedColumn');
    const deleteColumns = colums.filter(i => i.action === 'deleted');
    this.columnMetadataService.saveMaster({ addColumns, updateColumns, deleteColumns }).subscribe((resp: any) => {
      if (!resp.error) {
        this.showToast('success', 'All operations are successful.');
      } else {
        this.errors.saveError = true;
        this.errors.errorMsg = resp.message;
        this.showErros();
        this.showToast('error', 'Could not perform all operations.');
      }
      localStorage.removeItem('localCopyOfVersion');
      this.enableSaveChanges = false;
      this.ngOnInit();
      this.loader.save = false;
    }, error => {
      this.showToast('error', 'Could not perform all operations.');
      this.loader.save = false;
    });
  }

  generateNewVersion() {
    this.loader.columns = true;
    const allVersions = [];
    this.versions.forEach(element => {
      allVersions.push(element.METADATA_VERSION);
    });
    const request = {
      table_name: this.selectedTable.TABLE_NAME,
      version: Math.max(...allVersions)
    };
    this.columnMetadataService.generateNewVersion(request).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Version Created!');
        this.ngOnInit();
      } else {
        this.showToast('error', 'Could not create version.');
      }
      this.loader.columns = false;
    }, error => {
      this.showToast('error', 'Could not create version.');
      this.loader.columns = false;
    });
  }

  showMapping(data) {
    const ref = this.dialogService.open(MetadataMappingComponent, {
      header: 'Errors',
      width: '45%',
      data
    });
  }

  showErros() {
    const ref = this.dialogService.open(MetadataMappingComponent, {
      header: 'Errors',
      width: '45%',
      data: this.errors
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
