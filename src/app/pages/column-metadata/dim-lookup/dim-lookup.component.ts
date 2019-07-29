import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { lookUpColumns } from '../tableColumns';
import { AddComponent } from './add/add.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dim-lookup',
  templateUrl: './dim-lookup.component.html',
  styleUrls: ['./dim-lookup.component.scss'],
  providers: [DialogService]
})
export class DimLookupComponent implements OnInit {

  selectedTable: any;
  state: any;
  uniqueTables: any;
  selectedTableName: any;
  lookUps: any;
  tableColumns = lookUpColumns;
  loader = {
    lookUps: false
  };

  constructor(
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
  }

  getAllTables() {
    this.columnMetadataService.getAllTablesInVersions().subscribe((resp: any) => {
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
    const request = { table_name: this.selectedTable.TABLE_NAME };
    this.columnMetadataService.getTableLookUps(request).subscribe((resp: any) => {
      this.lookUps = resp.data;
      this.loader.lookUps = false;
    }, error => {
      this.showToast('error', 'Could not get lookup info.');
      this.loader.lookUps = false;
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

  addNew() {
    const ref = this.dialogService.open(AddComponent, {
      header: 'DIM Look Up',
      width: '55%',
      data: this.selectedTable
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
