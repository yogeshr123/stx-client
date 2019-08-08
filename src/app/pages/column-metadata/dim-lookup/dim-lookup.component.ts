import { Component, OnInit } from '@angular/core';
import { DialogService, ConfirmationService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { lookUpColumns } from '../tableColumns';
import { AddComponent } from './add/add.component';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dim-lookup',
  templateUrl: './dim-lookup.component.html',
  styleUrls: ['./dim-lookup.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class DimLookupComponent implements OnInit {

  selectedTable: any;
  state: any;
  uniqueTables: any;
  selectedTableName: any;
  lookUps: any;
  tableColumns = lookUpColumns;
  loader = {
    lookUps: false,
    delete: false
  };
  dimensionTables = [];
  allColumns = [];
  deleteError = '';

  constructor(
    private confirmationService: ConfirmationService,
    private location: Location,
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
    }
    this.getRefreshTables();
    this.getAllColumns();
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions({ queryString: '' }).subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.uniqueTables = this.removeDuplicates(resp.data, 'TABLE_NAME');
        if (!this.state.CMV || !this.state.CMV.selectedTable) {
          this.selectedTable = this.uniqueTables[0];
          this.getLookUps();
        } else {
          const selectedTableName = this.uniqueTables.filter(i => i.TABLE_NAME === this.state.CMV.selectedTable.TABLE_NAME);
          if (selectedTableName && selectedTableName.length) {
            this.selectedTableName = selectedTableName[0];
            this.getLookUps();
          }
        }
      }
    });
  }

  getLookUps() {
    this.loader.lookUps = true;
    const request = {
      table_name: this.selectedTable.TABLE_NAME,
      columnVersion: this.selectedTable.METADATA_VERSION
    };
    this.columnMetadataService.getTableLookUps(request).subscribe((resp: any) => {
      this.lookUps = resp.data;
      this.loader.lookUps = false;
    }, error => {
      this.showToast('error', 'Could not get lookup info.');
      this.loader.lookUps = false;
    });
  }

  getRefreshTables() {
    this.columnMetadataService.getRefreshTables().subscribe((resp: any) => {
      this.dimensionTables = resp.data;
    }, error => {
      this.showToast('error', 'Could not get dimension tables.');
    });
  }

  getAllColumns() {
    const request = {
      table_name: this.selectedTable.TABLE_NAME,
      columnVersion: this.selectedTable.METADATA_VERSION
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      this.allColumns = resp.data;
    }, error => {
      this.showToast('error', 'Could not get dimension tables.');
    });
  }

  deleteDIMLookUp(lookUp) {
    this.deleteError = '';
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this lookup?',
      accept: () => {
        this.loader.delete = true;
        // Check If any columns present
        const request = {
          table_name: lookUp.TABLE_NAME,
          columnVersion: lookUp.METADATA_VERSION
        };
        this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
          if (!resp.error && resp.data && resp.data.length) {
            const selectedColumns = resp.data.filter(i => i.LOOKUP_TABLE_ALIAS === lookUp.LOOKUP_TABLE_ALIAS);
            if (selectedColumns && selectedColumns.length) {
              this.deleteError = 'You must delete all the added columns first.';
            } else {
              this.columnMetadataService.deleteLookups({ data: lookUp }).subscribe((resp2: any) => {
                if (!resp2.error) {
                  this.showToast('success', 'Successfully deleted!');
                  this.ngOnInit();
                } else {
                  this.showToast('error', 'Could not delete lookup.');
                }
                this.loader.delete = false;
              }, error => {
                this.showToast('error', 'Could not delete lookup.');
                this.loader.delete = false;
              });
            }
          }
        });
      }
    });
  }

  changeTable() {
    this.state.CMV = { ...this.state.CMV, selectedTable: this.selectedTableName };
    this.commonService.setState(this.state);
    this.ngOnInit();
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  addNew(action, lookUp?) {
    const aliases = this.lookUps.map(i => i.LOOKUP_TABLE_ALIAS);
    const colNamePrefix = this.lookUps.map(i => i.COLUMN_NAME_PREFIX);
    const ref = this.dialogService.open(AddComponent, {
      header: `Add DIM Look Up`,
      width: '55%',
      data: {
        selectedTable: this.selectedTable,
        dimensionTables: this.dimensionTables,
        allColumns: this.allColumns,
        action,
        lookUp,
        aliases,
        colNamePrefix
      }
    });

    ref.onClose.subscribe((reason) => {
      if (reason) {
        this.ngOnInit();
      }
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  goBack() {
    this.location.back();
  }

}
