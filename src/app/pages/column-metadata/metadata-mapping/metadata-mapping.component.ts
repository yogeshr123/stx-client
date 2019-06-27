import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';

@Component({
  selector: 'app-metadata-mapping',
  templateUrl: './metadata-mapping.component.html',
  styleUrls: ['./metadata-mapping.component.css']
})
export class MetadataMappingComponent implements OnInit {

  selectedVersion: any;
  loader = false;
  columnsData = {};

  constructor(
    private columnMetadataService: ColumnMetadataService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.selectedVersion = this.config.data;
    this.getColumnMapping(this.selectedVersion);
    this.getColumnMapping(this.selectedVersion - 1);
  }

  getColumnMapping(version) {
    this.loader = true;
    const request = {
      table_name: 'P250_ERROR_RATE_BY_ZONE_FACT',
      columnVersion: version
    };
    return this.columnMetadataService.getAllColumns(request).subscribe((resp: any) => {
      if (resp.data) {
        this.columnsData[version] = resp.data;
      }
      if (this.columnsData[this.selectedVersion] && this.columnsData[this.selectedVersion - 1]) {
        this.loader = false;
      }
    }, error => {
      this.loader = false;
    });
  }

}
