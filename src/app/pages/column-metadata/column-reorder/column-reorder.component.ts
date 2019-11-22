import { Component, OnInit } from '@angular/core';
import {
    DynamicDialogConfig,
    DynamicDialogRef,
    MessageService,
} from 'primeng/api';
import { ColumnMetadataService } from 'src/app/services/column-metadata.service';

@Component({
    selector: 'app-column-reorder',
    templateUrl: 'column-reorder.component.html',
    styleUrls: ['./column-reorder.component.scss'],
})
export class ColumnReorderComponent implements OnInit {
    tableInfo: any;
    columnsInfo: any;
    cols = [
        { header: 'SCHEMA_NAME' },
        { header: 'TABLE_NAME' },
        { header: 'TARGET_COLUMN_NAME' },
        { header: 'TARGET_COLUMN_ID' },
        { header: 'SRC_COLUMN_NAME' },
        { header: 'IS_NEW' },
    ];

    constructor(
        private columnMetadataService: ColumnMetadataService,
        public ref: DynamicDialogRef,
        private messageService: MessageService,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.tableInfo = this.config.data;
        this.getColumnData();
    }

    reorder(event) {
        console.log('event ', event);
        this.columnsInfo[event.dragIndex].reorderIndex = event.dropIndex;

        setTimeout(() => {
            console.log('this.columnsInfo ', this.columnsInfo);
        }, 2000);
    }

    getColumnData() {
        console.log('this.tableInfo ', this.tableInfo);
        const request = {
            table_name: this.tableInfo.TABLE_NAME,
            columnVersion: this.tableInfo.METADATA_VERSION,
            globalQuery: '',
        };

        this.columnMetadataService.getAllColumns(request).subscribe(
            (resp: any) => {
                this.columnsInfo = resp.data;
                this.columnsInfo.sort((a, b) => {
                    return a.TARGET_COLUMN_ID - b.TARGET_COLUMN_ID;
                });
                this.columnsInfo = this.columnsInfo.map((item, index) => {
                    item.reorderIndex = index + 1;
                    return item;
                });
                console.log('this.columnsInfo ', this.columnsInfo);
            },
            error => {
                this.showToast('error', 'Could not get column data.');
            }
        );
    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }
}
