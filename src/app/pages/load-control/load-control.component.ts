import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoadControlService } from '../../services/load-control.service';
import { NavigationExtras, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/components/table/table';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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

  selectedRecords: any[];
  selectedColumns: any[];
  globalQuery: string;
  schedulerDisplay: boolean = false;
  recurrencePatterIndex: number = 0;
  @ViewChild(Table, { static: false }) tableComponent: Table;

  constructor(
    private loadControlService: LoadControlService,
    private recordService: RecordService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService', sticky: true });
  }

  ngOnInit() {
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

    this.formInit();
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
    this.loadControlService.getRecords().subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.recordsArray = data.data;
        this.totalcols = [];
        for (var key in this.recordsArray[0]) {
          this.totalcols.push({ field: key, header: key.replace(/_/g, " ") });
        }
      }
    });
  }

  saveColumnState() {
    localStorage.setItem('selectedColumns', JSON.stringify(this.selectedColumns));
    this.resetFilters();
  }

  initColumnState() {
    this.selectedColumns = [
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

  onRowEdit(row: any) {
    this.recordService.changeActiveRecord(row);
    this.router.navigate(['/loadcontrol/edit']);
  }

  onStateSave(event: any) {
    console.log(event);
  }

  changeETLStatus(status: string) {
    // if (this.selectedRecords.length > 0) {
    //   let records = [];
    //   for (var _i = 0; _i < this.selectedRecords.length; _i++) {
    //     records.push({
    //       SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
    //       TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
    //       ENV_NAME: this.selectedRecords[_i].ENV_NAME,
    //     })
    //   }
    //   const body = {
    //     ETL_STATUS: status,
    //     records: records
    //   };

    //   this.loadControlService.changeETLStatus(body).subscribe((data: any) => {
    //     console.log(data);
    //     this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
    //   });
    // }
    this.messageService.add({ severity: 'success', summary: 'ETL status changed', life: 3000 });
  }

  resetExecutionStatus(status: string) {
    if (this.selectedRecords.length > 0) {
      let records = [];
      for (var _i = 0; _i < this.selectedRecords.length; _i++) {
        records.push({
          SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
          TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
          ENV_NAME: this.selectedRecords[_i].ENV_NAME,
        })
      }
      const body: any = {
        records: records,
        statusType: status
      };

      this.loadControlService.resetExecutionStatus(body).subscribe((data: any) => {
        this.loadAllRecords();
        this.messageService.add({ severity: 'success', summary: `${status} Execution status changed`, life: 3000 });
      });
    }
  }

  search() {
    if (undefined != this.globalQuery && null != this.globalQuery && this.globalQuery != "") {
      const body = {
        query: this.globalQuery
      };
      this.loadControlService.getSearchQueryResult(body).subscribe((data: any) => {
        if (data.data && data.data.length > 0) {
          this.recordsArray = data.data;
        }
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
        },
        reject: () => {
        }
      });
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Please select records first', life: 3000 });
    }
  }

  showScheduler() {
    this.schedulerDisplay = true;
  }

  onSchedulerSubmit() {
    // this.schedulerDisplay = false;
    let cronExpression = "";
    if (this.recurrencePatterIndex == 0) {
      cronExpression = "@daily";
      alert(`cronexpression is @daily`);
    }
    else if (this.recurrencePatterIndex == 1) {
      //  Set hourly recucrrence pattern
      const hourlyRecurrencePatternMinute = this.schedulerForm.controls.hourlyRecurrencePatternMinute.value;
      if (hourlyRecurrencePatternMinute >= 0 && hourlyRecurrencePatternMinute <= 59) {
        cronExpression = `${hourlyRecurrencePatternMinute} * * * *`;
        alert(`Generated cronexpression is ${cronExpression}`);
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
      }
    }
    else if (this.recurrencePatterIndex == 2) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set daily recucrrence pattern
      console.log(this.schedulerForm.controls.dailyRecurrencePattern.value);
      if (this.schedulerForm.controls.dailyRecurrencePattern.value == "selectedday") {
        const dailyRecurrencePatternDay = this.schedulerForm.controls.dailyRecurrencePatternDay.value;
        if (dailyRecurrencePatternDay > 0) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} 1/${dailyRecurrencePatternDay} * *`;
          alert(`Generated cronexpression is ${cronExpression}`);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
        }
      }
      else if (this.schedulerForm.controls.dailyRecurrencePattern.value == "everyweekday") {
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * * MON-FRI`;
        alert(`Generated cronexpression is ${cronExpression}`);
      }
    }
    else if (this.recurrencePatterIndex == 3) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set weekly recucrrence pattern

      const weeklyRecurrencePattern = this.schedulerForm.controls.weeklyRecurrencePattern.value;
      console.log(weeklyRecurrencePattern);
      if (weeklyRecurrencePattern.length > 0) {
        let weekString = weeklyRecurrencePattern.join(',');
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * * ${weekString}`;
        alert(`Generated cronexpression is ${cronExpression}`);
        //   // 0 10 * * MON,TUE
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
      }

    }
    else if (this.recurrencePatterIndex == 4) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set monthly recucrrence pattern
      if (this.schedulerForm.controls.monthlyRecurrencePattern.value == "selectedmonthday") {
        const monthlyRecurrencePatternDay = this.schedulerForm.controls.monthlyRecurrencePatternDay.value;
        const monthlyRecurrencePatternMonth = this.schedulerForm.controls.monthlyRecurrencePatternMonth.value;
        if (monthlyRecurrencePatternDay > 0 && monthlyRecurrencePatternDay <= 31 && monthlyRecurrencePatternMonth > 0 && monthlyRecurrencePatternMonth <= 12) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} ${monthlyRecurrencePatternDay} 1/${monthlyRecurrencePatternMonth} *`;
          alert(`Generated cronexpression is ${cronExpression}`);
          //0 10 10 1/5 *  
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
        }
      }
      else if (this.schedulerForm.controls.monthlyRecurrencePattern.value == "selectedmonthformat") {
        const monthlyRecurrencePatternDayFormat = this.schedulerForm.controls.monthlyRecurrencePatternDayFormat.value;
        const monthlyRecurrencePatternWeekFormat = this.schedulerForm.controls.monthlyRecurrencePatternWeekFormat.value;
        const monthlyRecurrencePatternMonth = this.schedulerForm.controls.monthlyRecurrencePatternMonth.value;
        if (monthlyRecurrencePatternMonth > 0 && monthlyRecurrencePatternMonth <= 12) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * 1/${monthlyRecurrencePatternMonth} ${monthlyRecurrencePatternWeekFormat}#${monthlyRecurrencePatternDayFormat}`;
          alert(`Generated cronexpression is ${cronExpression}`);
          //0 12 * 1/2 MON#3
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
        }
      }
    }
    else if (this.recurrencePatterIndex == 5) {
      const scheduleStartTime = this.schedulerForm.controls.scheduleStartTime.value;
      let scheduleStartTimeHour = new Date(scheduleStartTime).getHours();
      let scheduleStartTimeMin = new Date(scheduleStartTime).getMinutes();
      //  Set yearly recucrrence pattern
      if (this.schedulerForm.controls.yearlyRecurrencePattern.value == "selectedyearmonth") {
        const yearlyRecurrencePatternMonth = this.schedulerForm.controls.yearlyRecurrencePatternMonth.value;
        const yearlyRecurrencePatternDay = this.schedulerForm.controls.yearlyRecurrencePatternDay.value;
        if (yearlyRecurrencePatternDay > 0 && yearlyRecurrencePatternDay <= 31) {
          cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} ${yearlyRecurrencePatternDay} ${yearlyRecurrencePatternMonth} *`;
          alert(`Generated cronexpression is ${cronExpression}`);
          //0 10 20 1 *


        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'Recurrence pattern is not valid', life: 3000 });
        }
      }
      else if (this.schedulerForm.controls.yearlyRecurrencePattern.value == "selectedyearformat") {
        const yearlyRecurrencePatternDayFormat = this.schedulerForm.controls.yearlyRecurrencePatternDayFormat.value;
        const yearlyRecurrencePatternWeekFormat = this.schedulerForm.controls.yearlyRecurrencePatternWeekFormat.value;
        const yearlyRecurrencePatternMonth = this.schedulerForm.controls.yearlyRecurrencePatternMonth.value;
        cronExpression = `${scheduleStartTimeMin} ${scheduleStartTimeHour} * ${yearlyRecurrencePatternMonth} ${yearlyRecurrencePatternWeekFormat}#${yearlyRecurrencePatternDayFormat}`;
        alert(`Generated cronexpression is ${cronExpression}`);
        //0 12 * 5 WED#2
      }

    }

    if (this.selectedRecords && this.selectedRecords.length > 0) {
      let records = [];
      for (var _i = 0; _i < this.selectedRecords.length; _i++) {
        records.push({
          SCHEMA_NAME: this.selectedRecords[_i].SCHEMA_NAME,
          TABLE_NAME: this.selectedRecords[_i].TABLE_NAME,
          ENV_NAME: this.selectedRecords[_i].ENV_NAME,
        })
      }
      const body: any = {
        records: records,
        schedulerInterval: cronExpression
      };

      this.loadControlService.setSchedulerInterval(body).subscribe((data: any) => {
        this.loadAllRecords();
        this.messageService.add({ severity: 'success', summary: `Schduler interval saved`, life: 3000 });
      });
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Please select records first', life: 3000 });
    }
  }
}





