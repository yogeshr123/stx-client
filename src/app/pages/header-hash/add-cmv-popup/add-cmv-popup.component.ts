import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { HeaderHashService } from 'src/app/services/header-hash.service';

@Component({
  selector: 'app-add-cmv-popup',
  templateUrl: './add-cmv-popup.component.html',
  styleUrls: ['./add-cmv-popup.component.scss']
})
export class AddCmvPopupComponent implements OnInit {

  header: any;
  status: any;
  saveLoader = false;
  formValues = {
    dataType: '',
    precisionLeft: 0,
    precisionRight: 0
  };
  isValid = true;

  constructor(
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private headerHashService: HeaderHashService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.header = this.config.data.header;
    this.status = this.config.data.status;
  }

  checkFormValidation() {
    if (!this.formValues.dataType) {
      this.isValid = false;
    } else {
      if (this.formValues.dataType === 'decimal') {
        if (!this.formValues.precisionLeft || !this.formValues.precisionRight) {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
      } else {
        this.isValid = false;
      }
    }
  }

  saveColumn() {
    this.saveLoader = true;
    let formValues = Object.assign({}, this.header);
    formValues = { ...formValues, formValues: this.formValues };
    if (formValues.formValues.dataType === 'decimal') {
      formValues.formValues.dataType =
        `${formValues.formValues.dataType}(${formValues.formValues.precisionLeft},${formValues.formValues.precisionRight})`;
    }
    this.headerHashService.addToColumnMetadata({ columnData: formValues }).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Successfully Added!');
        this.closePopUp(true);
      } else {
        this.showToast('error', 'Could not be added!');
      }
      this.saveLoader = false;
    }, () => {
      this.saveLoader = false;
      this.showToast('error', 'Could not be added!');
    });
  }

  closePopUp(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
