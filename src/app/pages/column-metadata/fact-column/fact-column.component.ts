import { Component, OnInit } from '@angular/core';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-fact-column',
  templateUrl: './fact-column.component.html',
  styleUrls: ['./fact-column.component.scss']
})
export class FactColumnComponent implements OnInit {

  tables: any;
  selectedTable: any;
  errors = '';
  columns: any;

  constructor(
    private messageService: MessageService,
    private columnMetadataService: ColumnMetadataService,
  ) { }

  ngOnInit() {
    this.getAllTables();
  }

  getAllTables() {
    this.columnMetadataService.getAllLoadControlTables().subscribe((resp: any) => {
      if (resp.data && resp.data.length) {
        this.tables = resp.data;
        this.tables = this.tables.map(i => {
          i.schemaTableName = `${i.SCHEMA_NAME}-${i.TABLE_NAME}`;
          return i;
        });
        this.tables = this.removeDuplicates(this.tables, 'schemaTableName');
      }
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  tableSelected() {
    this.errors = '';
    this.getTableVersions(this.selectedTable.TABLE_NAME);
  }

  getTableVersions(tableName) {
    const request = {
      table_name: tableName
    };
    this.columnMetadataService.getTableVersions(request).subscribe((resp: any) => {
      if (!resp.error && resp.data && resp.data.length) {
        let metadataVersions = resp.data.map(i => {
          if (i.STATUS === 'VALIDATED') {
            return i.METADATA_VERSION;
          }
        });
        if (metadataVersions && metadataVersions.length) {
          metadataVersions = metadataVersions.filter(i => i !== undefined);
          const maximumVersion = Math.max.apply(null, metadataVersions);
          this.getColumns(tableName, maximumVersion);
        } else {
          this.errors = 'There are no columns available';
        }
      }
    });
  }

  getColumns(tableName, metadataVersion) {
    const request = {
      table_name: tableName,
      columnVersion: metadataVersion
    };
    this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      if (!resp.error && resp.data && resp.data.length) {
        this.columns = resp.data;
      }
    }, error => {
      this.showToast('error', 'Could not get columns added');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
