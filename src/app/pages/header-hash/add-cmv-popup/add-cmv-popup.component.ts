import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, MessageService, DialogService } from 'primeng/api';
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
    precision: ''
  };

  constructor(
    public dialogService: DialogService,
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
    this.headerHashService.addToColumnMetadata({ columnData: this.header }).subscribe((resp: any) => {
      if (resp && !resp.error) {
        this.showToast('success', 'Successfully Added!');
      } else {
        this.showToast('error', 'Could not add!');
      }
      this.saveLoader = false;
    }, () => {
      this.saveLoader = false;
      this.showToast('error', 'Could not add!');
    });
  }

  closePopUp() {
    // this.dialogService.open()
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }

}
