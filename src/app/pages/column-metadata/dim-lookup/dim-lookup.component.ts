import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { lookUpColumns } from '../tableColumns';

@Component({
  selector: 'app-dim-lookup',
  templateUrl: './dim-lookup.component.html',
  styleUrls: ['./dim-lookup.component.scss'],
  providers: [DynamicDialogConfig]
})
export class DimLookupComponent implements OnInit {

  selectedTable: any;
  schemaNames = [{ label: 'DIM 1' }, { label: 'DIM 2' }, { label: 'DIM 3' }, { label: 'DIM 4' }];
  schemaTables = [{ label: 'SBR_DIM' }, { label: 'DATE_DIM' }, { label: 'PRODUCT_DIM' }, { label: 'LOCATION_DIM' }];
  state: any;
  uniqueTables: any;
  selectedTableName: any;
  lookUps: any;
  tableColumns = lookUpColumns;

  constructor(
    private columnMetadataService: ColumnMetadataService,
    private commonService: CommonService,
    public config: DynamicDialogConfig
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
          // this.viewData(this.selectedTable);
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
    const request = { table_name: this.selectedTable.TABLE_NAME };
    this.columnMetadataService.getTableLookUps(request).subscribe((resp: any) => {
      this.lookUps = resp.data;
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

}
