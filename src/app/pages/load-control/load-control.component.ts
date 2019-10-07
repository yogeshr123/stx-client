import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoadControlService } from '../../services/load-control.service';
import { NavigationExtras, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
declare var $: any;

@Component({
  selector: 'app-loadcontrol',
  templateUrl: './load-control.component.html',
  styleUrls: ['./load-control.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadControlComponent implements OnInit {

  schedulerForm: FormGroup;
  recordsArray: any[];
  ENV_NAME: any[];
  totalcols: any[];
  initialBinding = true;

  selectedRecords: any[] = [];
  selectedColumns: any[];
  globalQuery: string;
  schedulerDisplay: boolean = false;
  changeStatusDisplay: boolean = false;
  recurrencePatterIndex: number = 0;
  recordMeta: any;
  appState: any;
  statusType: string;
  statusValue: string;
  statusValueReason: string;
  loader = false;
  weekelyRecurrenceCheckedDays = [];

  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private loadControlService: LoadControlService,
    private recordService: RecordService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
  }

  async ngOnInit() {
    this.formInit();
    this.appState = this.commonService.getState();
    await this.getColumnDataType();
    this.loadAllRecords();

    this.ENV_NAME = [
      { label: 'PRD', value: 'PRD' },
      { label: 'DEV', value: 'DEV' },
      { label: 'QA', value: 'QA' }
    ];
    if (!localStorage.getItem('selectedColumns')) {
      this.initColumnState();
    } else {
      // get selected columns from local storage
      this.selectedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
    }

    $(document).ready(() => {
      var button = document.getElementById('slide');
      button.onclick = function () {
        var container = document.getElementsByClassName('ui-table-wrapper')[0];
        sideScroll(container, 'right', 0, 200, 100);
      };

      var back = document.getElementById('slideBack');
      back.onclick = function () {
        var container = document.getElementsByClassName('ui-table-wrapper')[0];
        sideScroll(container, 'left', 0, 200, 100);
      };

      function sideScroll(element, direction, speed, distance, step) {
        var scrollAmount = 0;
        var slideTimer = setInterval(function () {
          if (direction == 'left') {
            element.scrollLeft -= step;
          } else {
            element.scrollLeft += step;
          }
          scrollAmount += step;
          if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
          }
        }, speed);
      }
    });
  }

  formInit() {
    this.schedulerForm = this.formBuilder.group({
      scheduleStartTime: [new Date()],
      hourlyRecurrencePatternMinute: [0],
      dailyRecurrencePattern: ['selectedday'],
      dailyRecurrencePatternDay: [1],
      weeklyRecurrencePattern: [[]], //this.formBuilder.array([]),// [['SUN', 'MON']],
      monthlyRecurrencePattern: ['selectedmonthday'],
      monthlyRecurrencePatternDay: [1],
      monthlyRecurrencePatternMonth: [1],
      monthlyRecurrencePatternDayFormat: ['1'],
      monthlyRecurrencePatternWeekFormat: ['SUN'],
      yearlyRecurrencePattern: ['selectedyearmonth'],
      yearlyRecurrencePatternMonth: ['1'],
      yearlyRecurrencePatternDay: [1],
      yearlyRecurrencePatternDayFormat: ['1'],
      yearlyRecurrencePatternWeekFormat: ['SUN']
    });
  }

  loadAllRecords() {
    this.loader = true;
    this.loadControlService.getRecords().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordsArray = data.data;
        this.totalcols = [];
        for (var key in this.recordsArray[0]) {
          if (this.checkIfURL(key) === true)
            this.totalcols.push({ field: key, header: key.replace(/_/g, " "), type: 'link' });
          else if (this.checkIfDate(key) === true)
            this.totalcols.push({ field: key, header: key.replace(/_/g, " "), type: 'date' });
          else if (this.checkIfBit(key) === true)
            this.totalcols.push({ field: key, header: key.replace(/_/g, " "), type: 'bit' });
          else
            this.totalcols.push({ field: key, header: key.replace(/_/g, " ") });

        }
      }
      this.loader = false;
    }, error => {
      this.loader = false;
      this.showToast('error', 'Error while fetching data.');
    });
  }

  checkIfURL(key) {
    let returnVal;
    switch (key) {
      case "ETL_DAG_RUN_URL": {
        returnVal = true;
        break;
      }
      case "T1_SPARK_UI_URL": {
        returnVal = true;
        break;
      }
      case "T1_SPARK_LOG_URL": {
        returnVal = true;
        break;
      }
      case "T2_SPARK_UI_URL": {
        returnVal = true;
        break;
      }
      case "T2_SPARK_LOG_URL": {
        returnVal = true;
        break;
      }
      default: {
        returnVal = false;
        break;
      }
    }
    return returnVal;
  }

  checkIfDate(key) {
    if (this.recordMeta) {
      const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
      if (index) {
        const dataType = this.recordMeta[index].DATA_TYPE;
        if (dataType == "timestamp") {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }

  checkIfBit(key) {
    if (this.recordMeta) {
      const index = Object.keys(this.recordMeta).find(k => this.recordMeta[k].COLUMN_NAME === key);
      if (index) {
        const dataType = this.recordMeta[index].DATA_TYPE;
        if (dataType == "bit") {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }

  saveColumnState() {
    localStorage.setItem('selectedColumns', JSON.stringify(this.selectedColumns));
    this.resetFilters();
  }

  initColumnState() {
    this.selectedColumns = [
      { field: 'TABLE_STATUS', header: 'TABLE STATUS' },
      { field: 'SCHEMA_NAME', header: 'SCHEMA NAME' },
      { field: 'TABLE_NAME', header: 'TABLE NAME' },
      { field: 'ENV_NAME', header: 'ENV NAME' },
      { field: 'ETL_STATUS', header: 'ETL STATUS' },
      { field: 'ETL_EXECUTION_STATUS', header: 'ETL EXECUTION STATUS' },
      { field: 'T1_EXECUTION_STATUS', header: 'T1 EXECUTION STATUS' },
      { field: 'T2_EXECUTION_STATUS', header: 'T2 EXECUTION STATUS' },
      { field: 'DAG_SCHEDULE_INTERVAL', header: 'DAG SCHEDULE INTERVAL' },
    ];
  }

  resetTable() {
    const statefilter = JSON.parse(localStorage.getItem('statedemo-local'));
    if (statefilter) {
      localStorage.removeItem('statedemo-local');
    }
    const columnState = JSON.parse(localStorage.getItem('selectedColumns'));
    if (columnState) {
      localStorage.removeItem('selectedColumns');
      this.initColumnState();
    }
    this.tableComponent.reset();
  }

  resetFilters() {
    const statefilter = JSON.parse(localStorage.getItem('statedemo-local'));
    if (statefilter) {
      localStorage.removeItem('statedemo-local');
    }
    this.tableComponent.reset();
  }

  onRowEdit(row: any, edit: boolean) {
    // this.recordService.changeActiveRecord(row);
    const tempState: any = {
      edit: edit,
      record: row
    };
    this.appState = { ...this.appState, selectedRecord: tempState };
    this.commonService.setState(this.appState);
    if (edit) {
      this.router.navigate(['/loadcontrol/edit']);
    }
    else {
      this.router.navigate(['/loadcontrol/view']);
    }
  }

  onStateSave(event: any) {
    // console.log(event);
  }

  changeETLStatus(status: string) {
    if (this.selectedRecords.length > 0) {
      let records = [];
      for (var _i = 0; _i < this.selectedRecords.length; _i++) {
        if (status === "TRIGGER") {
          if ((this.selectedRecords[_i].TABLE_STATUS === "TODO" || this.selectedRecords[_i].TABLE_STATUS === "COMPLETE")
            && this.selectedRecords[_i].DAG_AVAILABLE_STATUS === "COMPLETE") {
            records.push({
              SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
              TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
              ENV_NAME: this.selectedRecords[_i].ENV_NAME,
            })
          }
        }
        else if (status === "KILL") {
          if (this.selectedRecords[_i].TABLE_STATUS === "RUNNING" && this.selectedRecords[_i].DAG_AVAILABLE_STATUS === "COMPLETE") {
            records.push({
              SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
              TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
              ENV_NAME: this.selectedRecords[_i].ENV_NAME,
            })
          }
        }
      }
      if (records.length > 0) {
        const body: any = {
          records: records,
          status: status,
        };
        this.loadControlService.changeETLStatus(body).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
        });
      }
      else {
        this.showToast('info', 'No record found for the valid criteria');
      }
    }
  }

  changeStatus() {
    if (this.selectedRecords.length > 0) {
      let records = [];
      for (var _i = 0; _i < this.selectedRecords.length; _i++) {
        records.push({
          SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
          TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
          ENV_NAME: this.selectedRecords[_i].ENV_NAME,
          UPDATED_BY: this.appState.loggedInUser.USER_NAME,
          UPDATE_DATE: `${new Date()}`
        })
      }
      const body: any = {
        records: records,
        statusType: this.statusType,
        statusValue: this.statusValue
      };
      if (this.statusType === "ETL") {
        body.statusValueReason = this.statusValueReason;
      }

      this.loadControlService.changeStatus(body).subscribe((data: any) => {
        this.loadAllRecords();
        this.showToast('success', `${this.statusType} status changed`);
        this.changeStatusDisplay = false;
      }, error => {
        this.showToast('error', 'Could not update status.');
      });
    }
  }
  resetExecutionStatus(status: string) {
    if (this.selectedRecords.length > 0) {
      let records = [];
      for (var _i = 0; _i < this.selectedRecords.length; _i++) {
        records.push({
          SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
          TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
          ENV_NAME: this.selectedRecords[_i].ENV_NAME,
          UPDATED_BY: this.appState.loggedInUser.USER_NAME,
          UPDATE_DATE: `${new Date()}`
        })
      }
      const body: any = {
        records: records,
        statusType: status
      };

      this.loadControlService.resetExecutionStatus(body).subscribe((data: any) => {
        this.loadAllRecords();
        this.showToast('success', `${status} Execution status changed`);
      }, error => {
        this.showToast('error', 'Could not update execution status.');
      });
    }
  }

  search() {
    if (undefined != this.globalQuery && null != this.globalQuery && this.globalQuery != "") {
      const body = {
        query: this.globalQuery
      };
      this.loadControlService.getSearchQueryResult(body).subscribe((data: any) => {
        if (data && data.data) {
          this.recordsArray = data.data;
        }
      }, error => {
        this.showToast('error', 'Error while fetching data');
      });
    }
  }

  globalQueryEmpty() {
    if (undefined == this.globalQuery || null == this.globalQuery || this.globalQuery == "") {
      this.loadAllRecords();
    }
  }

  confirmAction(message: string, functionName: string, action: string) {
    if (this.selectedRecords && this.selectedRecords.length > 0) {
      this.confirmationService.confirm({
        message: `Do you want to ${message}?`,
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          if (functionName == 'changeETLStatus') {
            this.changeETLStatus(action);
          }
          else if (functionName == 'resetExecutionStatus') {
            this.resetExecutionStatus(action);
          }
          else if (functionName == 'changeStatus') {
            this.changeStatus();
          }
        },
        reject: () => {
        }
      });
    }
    else {
      this.showToast('info', 'Please select records first');
    }
  }

  showScheduler() {
    this.schedulerDisplay = true;
  }

  onCheckWeeklyRecurrencePattern(event, inputId) {
    if (event) {
      this.weekelyRecurrenceCheckedDays.push(inputId);
    } else {
      this.weekelyRecurrenceCheckedDays = this.weekelyRecurrenceCheckedDays.filter(i => i !== inputId);
    }
  }

  onSchedulerSubmit() {
    // this.schedulerDisplay = false;
    let cronExpression = "";
    let isValidCronExpression = false;

    if (this.recurrencePatterIndex == 0) {
      cronExpression = "@daily";
      isValidCronExpression = true;
      alert(`cronexpression is @daily`);
    } else if (this.recurrencePatterIndex == 1) {
      //  Set hourly recucrrence pattern
      const hourlyRecurrencePatternMinute = this.schedulerForm.controls.hourlyRecurrencePatternMinute.value;
      if (hourlyRecurrencePatternMinute >= 0 && hourlyRecurrencePatternMinute <= 59) {
        cronExpression = `${hourlyRecurrencePatternMinute} * * * * *`;
        isValidCronExpression = true;
        alert(`Generated cronexpression is ${cronExpression}`);
      } else {
        this.showToast('warn', 'Recurrence pattern is not valid');
      }
    } else if (this.recurrencePatterIndex == 2) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set daily recucrrence pattern
      if (this.schedulerForm.controls.dailyRecurrencePattern.value == "selectedday") {
        const dailyRecurrencePatternDay = this.schedulerForm.controls.dailyRecurrencePatternDay.value;
        if (dailyRecurrencePatternDay > 0) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} 1/${dailyRecurrencePatternDay} * * *`;
          isValidCronExpression = true;
          alert(`Generated cronexpression is ${cronExpression}`);
        } else {
          this.showToast('warn', 'Recurrence pattern is not valid');
        }
      } else if (this.schedulerForm.controls.dailyRecurrencePattern.value == "everyweekday") {
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * * MON-FRI *`;
        isValidCronExpression = true;
        alert(`Generated cronexpression is ${cronExpression}`);
      }
    } else if (this.recurrencePatterIndex == 3) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      const scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      const scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set weekly recucrrence pattern
      if (this.weekelyRecurrenceCheckedDays.length > 0) {
        const weekString = this.weekelyRecurrenceCheckedDays.join(',');
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * * ${weekString} *`;
        isValidCronExpression = true;
        alert(`Generated cronexpression is ${cronExpression}`);
      } else {
        this.showToast('warn', 'Recurrence pattern is not valid');
      }
    } else if (this.recurrencePatterIndex == 4) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set monthly recucrrence pattern
      if (this.schedulerForm.controls.monthlyRecurrencePattern.value == "selectedmonthday") {
        const monthlyRecurrencePatternDay = this.schedulerForm.controls.monthlyRecurrencePatternDay.value;
        const monthlyRecurrencePatternMonth = this.schedulerForm.controls.monthlyRecurrencePatternMonth.value;
        if (monthlyRecurrencePatternDay > 0 && monthlyRecurrencePatternDay <= 31 && monthlyRecurrencePatternMonth > 0 && monthlyRecurrencePatternMonth <= 12) {
          // tslint:disable-next-line:max-line-length
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} ${monthlyRecurrencePatternDay} 1/${monthlyRecurrencePatternMonth} * *`;
          isValidCronExpression = true;
          alert(`Generated cronexpression is ${cronExpression}`);
        } else {
          this.showToast('warn', 'Recurrence pattern is not valid');
        }
      } else if (this.schedulerForm.controls.monthlyRecurrencePattern.value == "selectedmonthformat") {
        const monthlyRecurrencePatternDayFormat = this.schedulerForm.controls.monthlyRecurrencePatternDayFormat.value;
        const monthlyRecurrencePatternWeekFormat = this.schedulerForm.controls.monthlyRecurrencePatternWeekFormat.value;
        const monthlyRecurrencePatternMonth = this.schedulerForm.controls.monthlyRecurrencePatternMonth.value;
        if (monthlyRecurrencePatternMonth > 0 && monthlyRecurrencePatternMonth <= 12) {
          // tslint:disable-next-line:max-line-length
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * 1/${monthlyRecurrencePatternMonth} ${monthlyRecurrencePatternWeekFormat}#${monthlyRecurrencePatternDayFormat} *`;
          isValidCronExpression = true;
          alert(`Generated cronexpression is ${cronExpression}`);
        } else {
          this.showToast('warn', 'Recurrence pattern is not valid');
        }
      }
    } else if (this.recurrencePatterIndex == 5) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set yearly recucrrence pattern
      if (this.schedulerForm.controls.yearlyRecurrencePattern.value == "selectedyearmonth") {
        const yearlyRecurrencePatternMonth = this.schedulerForm.controls.yearlyRecurrencePatternMonth.value;
        const yearlyRecurrencePatternDay = this.schedulerForm.controls.yearlyRecurrencePatternDay.value;
        if (yearlyRecurrencePatternDay > 0 && yearlyRecurrencePatternDay <= 31) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} ${yearlyRecurrencePatternDay} ${yearlyRecurrencePatternMonth} * *`;
          isValidCronExpression = true;
          alert(`Generated cronexpression is ${cronExpression}`);
        } else {
          this.showToast('warn', 'Recurrence pattern is not valid');
        }
      } else if (this.schedulerForm.controls.yearlyRecurrencePattern.value == "selectedyearformat") {
        const yearlyRecurrencePatternDayFormat = this.schedulerForm.controls.yearlyRecurrencePatternDayFormat.value;
        const yearlyRecurrencePatternWeekFormat = this.schedulerForm.controls.yearlyRecurrencePatternWeekFormat.value;
        const yearlyRecurrencePatternMonth = this.schedulerForm.controls.yearlyRecurrencePatternMonth.value;
        // tslint:disable-next-line:max-line-length
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * ${yearlyRecurrencePatternMonth} ${yearlyRecurrencePatternWeekFormat}#${yearlyRecurrencePatternDayFormat} *`;
        isValidCronExpression = true;
        alert(`Generated cronexpression is ${cronExpression}`);
      }
    } else if (this.recurrencePatterIndex == 6) {
      cronExpression = "none";
      isValidCronExpression = true;
      alert(`cronexpression is none`);
    }

    if (this.selectedRecords && this.selectedRecords.length > 0) {
      if (isValidCronExpression) {
        let records = [];
        for (var _i = 0; _i < this.selectedRecords.length; _i++) {
          records.push({
            SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
            TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
            ENV_NAME: this.selectedRecords[_i].ENV_NAME,
            DAG_SCHEDULE_INTERVAL: cronExpression,
            UPDATED_BY: this.appState.loggedInUser.USER_NAME,
            UPDATE_DATE: `${new Date()}`
          })
        }
        const body: any = {
          records: records
        };

        this.loadControlService.setSchedulerInterval(body).subscribe((data: any) => {
          this.loadAllRecords();
          this.schedulerDisplay = false;
          this.showToast('success', 'Scheduler interval saved');
        }, error => {
          this.showToast('error', 'Could not save Scheduler interval.');
        });
      }
    }
    else {
      this.showToast('info', 'Please select records first');
    }
  }

  getColumnDataType() {
    this.loadControlService.getColumnDataType().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordMeta = data.data;
      }
    }, error => {
      this.showToast('error', 'Error while fetching data.');
    });
  }

  showStatusDialog(status: string) {
    this.changeStatusDisplay = true;
    this.statusType = status;
  }

  showToast(severity, summary) {
    this.messageService.add({ severity, summary, life: 3000 });
  }
}