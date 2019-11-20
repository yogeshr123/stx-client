import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
    MessageService,
    DialogService,
    ConfirmationService,
} from 'primeng/api';
import { headerMismatchesTableCols } from '../tableColumns';
import { HeaderHashService } from 'src/app/services/header-hash.service';
import { AddCmvPopupComponent } from '../add-cmv-popup/add-cmv-popup.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-add-edit-header',
    templateUrl: './add-edit-header.component.html',
    styleUrls: ['./add-edit-header.component.scss'],
    providers: [DialogService],
})
export class AddEditHeaderComponent implements OnInit {
    routeInfo = {
        path: '',
        id: '',
        isViewOnly: false,
        isEditMode: false,
    };
    TABLE_NAME: any;
    appState: any;
    header: any;
    headerMismatches: any;
    dataLoader = false;
    showConfirmation = false;
    headerMismatchesTableCols = headerMismatchesTableCols;
    hasDimColumns = 'false';

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private messageService: MessageService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private location: Location,
        public dialogService: DialogService,
        private headerHashService: HeaderHashService
    ) {
        this.route.params.subscribe(params => {
            this.routeInfo.id = params.headerId;
        });
        this.route.url.subscribe(params => {
            this.routeInfo.path = params[0].path;
            if (this.routeInfo.path.indexOf('view') > -1) {
                this.routeInfo.isViewOnly = true;
            }
            if (this.routeInfo.path.indexOf('edit') > -1) {
                this.routeInfo.isEditMode = true;
            }
        });
    }

    ngOnInit() {
        this.appState = JSON.parse(localStorage.getItem('appState'));
        if (
            this.appState &&
            this.appState.CMV &&
            this.appState.CMV.selectedTable
        ) {
            this.TABLE_NAME = this.appState.CMV.selectedTable.TABLE_NAME;
        }
        this.getHeaderMismatches();
        this.getHeaderByHash();
    }

    getHeaderByHash() {
        const request = {
            table_name: this.TABLE_NAME,
            header_hash: this.routeInfo.id,
        };
        this.headerHashService
            .getHeaderByHash(request)
            .subscribe((res: any) => {
                if (res.data && res.data.length) {
                    this.header = res.data[0];
                }
            });
    }

    getHeaderMismatches() {
        this.dataLoader = true;
        const request = {
            table_name: this.TABLE_NAME,
            header_hash: this.routeInfo.id,
        };
        this.headerHashService
            .getHeaderMismatches(request)
            .subscribe((res: any) => {
                this.headerMismatches = res.data;
                this.dataLoader = false;
            });
    }

    confirmAction(status) {
        if (status) {
            this.headerHashService
                .approveHeader({
                    header: this.header,
                    hasDimensionColumn: this.hasDimColumns,
                })
                .subscribe(
                    (resp: any) => {
                        this.showConfirmation = false;
                        if (resp && !resp.error) {
                            this.showToast('success', 'Successfully Approved');
                            this.ngOnInit();
                        } else {
                            this.showToast('error', 'Approval failed');
                        }
                    },
                    error => {
                        this.showToast('error', 'Approval failed');
                    }
                );
        } else {
            this.showConfirmation = false;
        }
    }

    approveHeader() {
        this.hasDimColumns = 'false';
        this.showConfirmation = true;
    }

    addToCMV(header, status) {
        if (
            header.COLUMN_STATUS === 'DATATYPE_MISMATCH' ||
            header.STATUS === 'APPROVED'
        ) {
            const ref = this.dialogService.open(AddCmvPopupComponent, {
                header:
                    status === 'NEW'
                        ? 'Add Column To Column Metadata'
                        : 'View Details',
                width: '55%',
                closeOnEscape: true,
                data: {
                    header,
                    status:
                        this.header.STATUS !== 'APPROVED'
                            ? status
                            : this.header.STATUS,
                },
            });

            ref.onClose.subscribe(reason => {
                if (reason) {
                    this.ngOnInit();
                }
            });
        } else {
            this.appState = { ...this.appState, header };
            this.commonService.setState(this.appState);
            if (this.header.STATUS === 'APPROVED') {
                this.router.navigate([`/CMV/view-column/fhh`]);
            } else {
                this.router.navigate([`/CMV/add-column/fhh`]);
            }
        }
    }

    goBack() {
        this.location.back();
    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }
}
