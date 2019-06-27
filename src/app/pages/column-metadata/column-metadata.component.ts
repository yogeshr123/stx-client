import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';

import { MetadataMappingComponent } from './metadata-mapping/metadata-mapping.component';

@Component({
  selector: 'app-column-metadata',
  templateUrl: './column-metadata.component.html',
  styleUrls: ['./column-metadata.component.css'],
  providers: [DialogService]
})
export class ColumnMetadataComponent implements OnInit {

  versions = [
    {
      version: 2,
      date: '2019-05-14 21:33:06',
      status: 'NEW'
    },
    {
      version: 1,
      date: '2019-05-17 12:33:06',
      status: 'VALIDATED'
    }
  ];
  showMetaData = false;
  selectedVersion = 1;
  versionData = [
    {
      TARGET_COLUMN_ID: '2',
      SRC_COLUMN_NAME: 'avg_itrtn_per_cword',
      SRC_COLUMN_TYPE: 'MAPPED',
      SRC_DATA_TYPE: 'decimal(38,12)',
      TARGET_COLUMN_NAME: 'avg_itrtn_per_cword',
      TARGET_DATA_TYPE: 'decimal(38,12)',
      IS_PKEY_COLUMN: 0,
      IS_UPDATE_DATE_COLUMN: 0
    },
    {
      TARGET_COLUMN_ID: '5',
      SRC_COLUMN_NAME: 'birth_date',
      SRC_COLUMN_TYPE: 'MAPPED',
      SRC_DATA_TYPE: 'string',
      TARGET_COLUMN_NAME: 'birth_date',
      TARGET_DATA_TYPE: 'timestamp',
      IS_PKEY_COLUMN: 0,
      IS_UPDATE_DATE_COLUMN: 0
    },
    {
      TARGET_COLUMN_ID: '17',
      SRC_COLUMN_NAME: 'bits_in_error_cnt',
      SRC_COLUMN_TYPE: 'MAPPED',
      SRC_DATA_TYPE: 'integer',
      TARGET_COLUMN_NAME: 'bits_in_error_cnt',
      TARGET_DATA_TYPE: 'int',
      IS_PKEY_COLUMN: 0,
      IS_UPDATE_DATE_COLUMN: 0
    }
  ];
  loader = {
    columns: true
  };

  constructor(
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    // this.show();
  }

  viewData(version) {
    this.showMetaData = true;
    this.loader.columns = true;
    this.selectedVersion = version;
    setTimeout(() => {
      this.loader.columns = false;
    }, 1000);
  }

  show() {
    const ref = this.dialogService.open(MetadataMappingComponent, {
      header: 'Metadata Mapping',
      width: '45%'
    });
  }

}
