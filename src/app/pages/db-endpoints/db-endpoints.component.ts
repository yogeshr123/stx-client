import { Component, OnInit } from '@angular/core';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';
import { MessageService, DialogService } from 'primeng/api';
import { AddEditDbendpointComponent } from './add-edit-dbendpoint/add-edit-dbendpoint.component';

@Component({
  selector: 'app-db-endpoints',
  templateUrl: './db-endpoints.component.html',
  styleUrls: ['./db-endpoints.component.scss'],
  providers: [DialogService]
})
export class DbEndpointsComponent implements OnInit {
  dbEndpoints: any[];
  selectedEndpoint: any;
  dbEndpointColumns: any;
  constructor(
    private dbEndpointsService: DBEndpointsService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.dbEndpointColumns = [
      {
        header: 'DB_ID',
        field: 'DB_ID'
      },
      {
        header: 'HOST',
        field: 'HOST'
      },
      {
        header: 'DB_NAME',
        field: 'DB_NAME'
      },
      {
        header: 'UPDATE_DATE',
        field: 'UPDATE_DATE',
      },
      {
        header: 'UPDATED_BY',
        field: 'UPDATED_BY',
      }
    ];

    this.loadDBEndpoints();
  }

  loadDBEndpoints() {
    this.dbEndpointsService.getEndpoints().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.dbEndpoints = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

  selectEndpoint(endpoint: any) {
    this.selectedEndpoint = endpoint;
    this.addNew(false);
  }

  addNew(isNew) {
    let header;
    if (isNew) {
      this.selectedEndpoint = {};
      header = 'Add Endpoint';
    }
    else {
      header = 'Edit Endpoint';
    }
    const ref = this.dialogService.open(AddEditDbendpointComponent, {
      header: header,
      width: '55%',
      data: {
        selectedEndpoint: this.selectedEndpoint,
        isNew: isNew
      }
    });

    ref.onClose.subscribe((reason) => {
      if (reason) {
        this.ngOnInit();
      }
    });
  }
}
