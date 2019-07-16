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
    precision: '(0,0)'
  };

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

  saveColumn() {
    this.saveLoader = true;
    let formValues = Object.assign({}, this.header);
    formValues = { ...formValues, formValues: this.formValues };
    formValues.formValues.precision = formValues.formValues.precision.replace(/\s/g, '');
    if (!formValues.formValues.precision) {
      formValues.formValues.precision = '(0,0)';
    }
    const checkLeftBracket = /\(/g.test(formValues.formValues.precision);
    const checkRightBracket = /\)/g.test(formValues.formValues.precision);
    if (!checkLeftBracket) {
      formValues.formValues.precision = `(${formValues.formValues.precision}`;
    }
    if (!checkRightBracket) {
      formValues.formValues.precision = `${formValues.formValues.precision})`;
    }
    if (formValues.formValues.dataType === 'decimal') {
      formValues.formValues.dataType = `${formValues.formValues.dataType}${formValues.formValues.precision}`;
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
    this.saveLoader = false;
  }

  closePopUp(status) {
    this.ref.close(status);
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
