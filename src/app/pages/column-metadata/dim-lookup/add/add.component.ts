import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  selectedTable: any;
  dimensionTables: any;
  dimensionTableColumns: any;
  tableColumns: any;
  dimensionColumns: any;
  errors = {
    noValidatedVersion: ''
  };

  constructor(
    private columnMetadataService: ColumnMetadataService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.selectedTable = this.config.data.selectedTable;
    this.dimensionTables = this.config.data.dimensionTables;
    this.tableColumns = this.config.data.allColumns;
  }

  tableSelected(event) {
    this.errors.noValidatedVersion = null;
    this.dimensionTableColumns = [];
    this.getTableVersions(event.value.TABLE_NAME);
  }

  getTableVersions(tableName) {
    const request = {
      table_name: tableName
    };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      // console.log("resp ", resp);
      if (resp.data && resp.data.length) {
        let validatedVersions = resp.data.map(i => {
          if (i.STATUS === 'VALIDATED') {
            return i.METADATA_VERSION;
          }
        });
        validatedVersions = validatedVersions.filter(i => i !== undefined);
        if (validatedVersions && validatedVersions.length) {
          const max = Math.max.apply(null, validatedVersions);
          this.getDimensionColumns(tableName, max);
        } else {
          this.errors.noValidatedVersion = 'No validated version found for this table.';
        }
      }
    });
  }

  getDimensionColumns(tableName, version) {
    const request = {
      table_name: tableName,
      columnVersion: version
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      this.dimensionTableColumns = resp.data;
    }, error => {
      // this.showToast('error', 'Could not get dimension tables.');
    });
  }

}
