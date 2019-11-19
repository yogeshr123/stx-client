import { Component, OnInit } from '@angular/core';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { MessageService, DialogService } from 'primeng/api';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-db-endpoints',
    templateUrl: './db-endpoints.component.html',
    styleUrls: ['./db-endpoints.component.scss'],
})
export class DbEndpointsComponent implements OnInit {
    dbEndpoints: any[];
    selectedEndpoint: any;
    dbEndpointColumns: any;
    appState: any;

    constructor(
        private dbEndpointsService: DBEndpointsService,
        private messageService: MessageService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit() {
        this.appState = this.commonService.getState();
        this.dbEndpointColumns = [
            {
                header: 'DB_ID',
                field: 'DB_ID',
            },
            {
                header: 'HOST',
                field: 'HOST',
            },
            {
                header: 'DB_NAME',
                field: 'DB_NAME',
            },
            {
                header: 'UPDATE_DATE',
                field: 'UPDATE_DATE',
                type: 'date',
            },
            {
                header: 'UPDATED_BY',
                field: 'UPDATED_BY',
            },
        ];

        this.loadDBEndpoints();
    }

    loadDBEndpoints() {
        this.dbEndpointsService.getEndpoints().subscribe(
            (data: any) => {
                if (data.data && data.data.length > 0) {
                    this.dbEndpoints = data.data;
                }
            },
            error => {
                this.showToast('error', 'Error while fetching data.');
            }
        );
    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }

    selectEndpoint(endpoint: any, edit: boolean) {
        this.appState = { ...this.appState, selectedEndpoint: endpoint };
        this.commonService.setState(this.appState);
        if (edit) {
            this.router.navigate(['/db-endpoints/edit']);
        } else {
            this.router.navigate(['/db-endpoints/view']);
        }
    }
}
