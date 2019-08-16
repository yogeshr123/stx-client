import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DBEndpointsService } from 'src/app/services/db-endpoints.service';

@Component({
  selector: 'app-add-edit-dbendpoint',
  templateUrl: './add-edit-dbendpoint.component.html',
  styleUrls: ['./add-edit-dbendpoint.component.scss']
})
export class AddEditDbendpointComponent implements OnInit {

  addEditForm: FormGroup;
  selectedEndpoint: any;
  submitted: boolean = false;
  isNew: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private dbEndpointsService: DBEndpointsService
  ) { }

  ngOnInit() {
    this.selectedEndpoint = this.config.data.selectedEndpoint;
    this.isNew = this.config.data.isNew;
    this.formInit();
  }

  formInit() {
    this.addEditForm = this.formBuilder.group({
      DB_ID: [this.selectedEndpoint.DB_ID, Validators.required],
      HOST: [this.selectedEndpoint.HOST, Validators.required],
      DB_NAME: [this.selectedEndpoint.DB_NAME, Validators.required],
    });
  }

  get f() {
    return this.addEditForm.controls;
  }


  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addEditForm.invalid) {
      return;
    }

    let formValues = Object.assign({}, this.addEditForm.value);
    let tempEndpoint = formValues;
    tempEndpoint.UPDATE_DATE = `${new Date()}`;
    tempEndpoint.UPDATED_BY = 'user';
    if (this.isNew) {
      const body = {
        endpoint: tempEndpoint
      };
      this.dbEndpointsService.addEndpoint(body).subscribe((data: any) => {
        this.showToast('success', 'DB Endpoint saved.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not save DB endpoint.');
      });
    }
    else {
      const body = {
        endpoint: tempEndpoint,
        ID: this.selectedEndpoint.DB_ID
      };
      this.dbEndpointsService.updateEndpoint(body).subscribe((data: any) => {
        this.showToast('success', 'DB Endpoint updated.');
        this.closeModal(true);
      }, error => {
        this.showToast('error', 'Could not update DB endpoint.');
      });
    }
  }

  closeModal(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
