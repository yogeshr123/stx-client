import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoadStatusService } from 'src/app/services/load-status.service';
import { DayPilot } from 'daypilot-pro-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GanttComponent, GanttConfiguration, GanttTaskItem, GanttTaskLink, GanttEvents } from 'gantt-ui-component';

import * as frappeGantt from 'frappe-gantt';

@Component({
  selector: 'app-load-status',
  templateUrl: './load-status.component.html',
  styleUrls: ['./load-status.component.css']
})
export class LoadStatusComponent implements OnInit {

  tasks = [
    { id: 111, title: '', start_date: '2017-06-15', end_date: '2017-06-16', progress: 0.6, text: '' },
    { id: 1, title: 'Task #1', start_date: '2017-06-15 01:00', end_date: '2017-06-15 03:00', progress: 0.6, text: 'Task 1' },
    { id: 2, title: 'Task #2', start_date: '2017-06-15 02:00', end_date: '2017-06-15 02:30', progress: 0.6, text: 'Task 2' },
  ];
  ganttConfiguration: GanttConfiguration = {
    fit_tasks: true,
    scale_unit: 'hour',
    // step: {
    //   hour: 1
    // },
    row_height: 25,
    drag_resize: false,
    grid_columns: ['title'],
    controls: {
      hour: true
    }
  };


  searchForm: FormGroup;
  defaultDate: Date = new Date('Fri Jan 1 1970 00:00:00');
  config: any = {
    timeHeaders: [{ groupBy: 'Day', format: 'dddd, d MMMM yyyy' }, { groupBy: 'Hour', format: 'H' }],
    scale: 'Hour',
    startDate: new Date(),
    cellWidth: 25,
    TaskResizing: 'Disabled',
    days: 2,
    onTaskMove: args => {
      this.checkMovedTaskValidation(args);
    },
    onTaskClick: args => {
      // args.e.data.contextMenu.show();
    }
  };
  loader = {
    tasks: false,
    saveTasks: false,
  };
  tasksMoved = false;
  taskData: any;
  taskDataBackUp: any;
  errors = {
    updateEror: false
  };
  autocomplete = {
    SCHEMA_NAME: [],
    TABLE_NAME: [],
    DAG_NAME: []
  };
  toogleButtonPeriod = 7;
  frappeGanttChart: any;
  @ViewChild('ganttChart', { static: false }) ganttChart: ElementRef;

  constructor(
    private messageService: MessageService,
    private loadStatusService: LoadStatusService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.searchFormInit();
    this.getTasks();
    const tasks = [
      {
        id: 'Task 1',
        name: 'Redesign website',
        start: '2016-12-28 01:00:00',
        end: '2016-12-28 12:00:00',
        progress: 20
      }
    ];
    setTimeout(() => {
      this.frappeGanttChart = new frappeGantt.default(this.ganttChart.nativeElement, tasks, {
        // view_mode: 'hour'  
      });
      this.frappeGanttChart.change_view_mode('Hour');
    }, 1000);

  }

  searchFormInit() {
    this.searchForm = this.formBuilder.group({
      SCHEMA_NAME: '',
      TABLE_NAME: '',
      DAG_NAME: '',
      AVG_TIME: '',
      START_TIME: '',
      ENV_NAME: 'PRD'
    });
  }

  getSearchResult(formValues) {
    return this.taskDataBackUp.filter(item => {
      const notMatchingField = Object.keys(formValues)
        .find(key => {
          return item[key] !== formValues[key];
        });
      return !notMatchingField;
    });
  }

  updateTimePeriod(days) {
    this.toogleButtonPeriod = days;
    this.getTasks();
  }

  onSubmit(event?, isAutoComplete?) {
    if (event && event.keyCode === 8 && !event.target.value || isAutoComplete) {
      const formValues = Object.assign({}, this.searchForm.value);
      delete formValues.AVG_TIME;
      delete formValues.START_TIME;
      for (const propName in formValues) {
        if (!formValues[propName]) {
          delete formValues[propName];
        } else {
          if (propName !== 'DAG_NAME') {
            formValues[propName] = formValues[propName].toUpperCase();
          }
        }
      }
      this.taskData = this.getSearchResult(formValues);
      // Filter for Start Time
      if (this.searchForm.value.START_TIME) {
        const filterStartTime = this.searchForm.value.START_TIME;
        this.taskData = this.taskData.filter(i => {
          const taskStartTime = i.start;
          return new Date(taskStartTime).getTime() >= new Date(filterStartTime).getTime();
        });
      }
      // Filter for Avg Time
      if (this.searchForm.value.AVG_TIME) {
        const filterStartTime = new Date(this.searchForm.value.AVG_TIME);
        const getExecInSecs = this.hmsToSeconds(`${filterStartTime.getHours()}:${filterStartTime.getMinutes()}:00`);
        this.taskData = this.taskData.filter(i => i.EXEC_TIME >= getExecInSecs);
      }
      this.setGanttValues();
    }
  }

  setGanttValues() {
    const today = new Date();
    const year = today.getFullYear();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    this.taskData.map(item => {
      let barColor = '#009688';
      switch (item.STATUS) {
        case 'COMPLETED':
          barColor = 'green';
          break;
        case 'RUNNING':
          barColor = 'orange';
          break;
        case 'FAILED':
          barColor = 'red';
          break;
      }
      let calculatedEndTime: any = `${this.secondsToHMS(this.hmsToSeconds(item.START_TIME) + item.EXEC_TIME)}`;
      let hours: any = calculatedEndTime.substr(0, 2);
      const rest = calculatedEndTime.substr(2);
      if (hours > 24) {
        hours = hours - 24;
        calculatedEndTime = new Date(`${year}-${month}-${date + 1} ${hours}${rest}`);
      } else {
        calculatedEndTime = new Date(`${year}-${month}-${date} ${this.secondsToHMS(this.hmsToSeconds(item.START_TIME) + item.EXEC_TIME)}`);
      }
      item.start = new Date(`${year}-${month}-${date} ${item.START_TIME}`);
      item.complete = (item.T1_EXEC / item.EXEC_TIME) * 100;
      item.end = calculatedEndTime;
      item.type = 'Task';
      item.text = `${item.SCHEMA_NAME}.${item.TABLE_NAME}`;
      item.id = item.DAG_RUN_ID;
      item.box = {
        clickDisabled: false,
        bubbleHtml: `<b>
                        T1: ${
          Math.round((item.T1_EXEC / item.EXEC_TIME) * 100)
          }% and T2: ${Math.round((item.T2_EXEC / item.EXEC_TIME) * 100)}% | ${item.DAG_NAME}
                    </b>`,
        resizeDisabled: true,
        html: ` <b>${item.DAG_NAME}</b>`,
        htmlRight: `
                    <span
                        class="statusCircle ${item.DAG_NAME}"
                        title="T1: ${this.secondsToHMS(item.T1_EXEC)} and T2: ${this.secondsToHMS(item.T2_EXEC)}">
                    </span>
                          <span>Avg. Time: ${this.secondsToHMS(item.EXEC_TIME)}</span>`,
        barColor,
        contextMenu: new DayPilot.Menu({
          items: [
            // {
            //   text: item.T1_status === 'HOLD' ? `T1: RESUME` : 'T1: HOLD',
            //   icon: 'icon',
            //   onClick: args => {
            //     args.item.text = args.item.text === 'T1: HOLD' ? 'T1: RESUME' : 'T1: HOLD';
            //     this.tasksMoved = true;
            //     if (args.item.icon.indexOf('icon-blue') > -1) {
            //       args.item.icon = 'icon';
            //     } else {
            //       args.item.icon = 'icon icon-blue';
            //     }
            //     args.source.data.T1_status = args.item.text === 'T1: HOLD' ? 'RESUME' : 'HOLD';
            //     args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
            //     args.source.data.updated = true;
            //   }
            // },
            // {
            //   text: item.T2_status === 'HOLD' ? `T2: RESUME` : 'T2: HOLD',
            //   icon: 'icon',
            //   onClick: args => {
            //     args.item.text = args.item.text === 'T2: HOLD' ? 'T2: RESUME' : 'T2: HOLD';
            //     this.tasksMoved = true;
            //     if (args.item.icon.indexOf('icon-yellow') > -1) {
            //       args.item.icon = 'icon';
            //     } else {
            //       args.item.icon = 'icon icon-yellow';
            //     }
            //     args.source.data.T2_status = args.item.text === 'T2: HOLD' ? 'RESUME' : 'HOLD';
            //     args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
            //     args.source.data.updated = true;
            //   }
            // }
          ]
        })
      };
    });
    this.config.tasks = this.taskData;
  }

  getTasks() {
    this.loader.tasks = true;
    this.loadStatusService.getTasks(this.toogleButtonPeriod).subscribe((data: any) => {
      this.taskData = data.data;
      this.taskDataBackUp = this.taskData;
      if (this.taskData && this.taskData.length) {
        this.taskData.length = this.taskData.length < 10 ? this.taskData.length : 10;
        this.onSubmit(null, true);
      }
      this.loader.tasks = false;
    }, error => {
      this.loader.tasks = false;
    });
  }

  changeLimit(limit) {
    const selectedLimit = parseInt(limit, 10);
    this.taskData = Object.assign({}, this.taskDataBackUp);
    if (limit !== 'all') {
      if (selectedLimit > this.taskDataBackUp.length) {
        this.taskData.length = this.taskDataBackUp.length;
      } else {
        this.taskData.length = selectedLimit;
      }
    } else {
      this.taskData.length = this.taskDataBackUp.length;
    }
    this.setGanttValues();
  }

  discard() {
    this.getTasks();
    this.tasksMoved = false;
    this.toogleButtonPeriod = 7;
  }

  save() {
    this.errors.updateEror = false;
    this.loader.saveTasks = true;
    const updatedTasks = this.taskData.filter(item => item.updated === true);
    // updatedTasks.map(i => {
    //   console.log("i.start ", i.start);
    //   i.start = `${i.start}.000Z`;
    // });
    // console.log('updatedTasks ', updatedTasks);
    this.loadStatusService.updateTasks(updatedTasks).subscribe((resp: any) => {
      // console.log('resp ', resp.data);
      if (!resp.data.error || !resp.data.error.length) {
        this.tasksMoved = false;
        this.loader.saveTasks = false;
        this.messageService.add({ severity: 'success', summary: 'Details successfully saved!', life: 3000 });
      } else {
        this.errors.updateEror = true;
        this.messageService.add({ severity: 'error', summary: 'Could not update all records.', life: 3000 });
      }
      this.getTasks();
      this.loader.saveTasks = false;
      this.tasksMoved = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Could not save details.', life: 3000 });
      this.loader.saveTasks = false;
    });
  }

  checkMovedTaskValidation(event) {
    const args = event.e.data;
    const newStartDate = new Date(`${event.newStart}.000Z`).getUTCDate();
    const currentStartDate = new Date(this.config.startDate).getUTCDate();
    if (newStartDate < currentStartDate || currentStartDate === 1 && [30, 31, 28].indexOf(newStartDate) > -1) {
      event.preventDefault();
    } else {
      this.tasksMoved = true;
      args.task.updated = true;
      args.task.box.backColor = 'rgba(230, 109, 245, 1)';
      args.task.box.cssClass = 'movedItem';
    }
  }

  filter(query, arrayToFilter) {
    const result = [];
    this.taskDataBackUp.filter(item => {
      if (item[arrayToFilter] && item[arrayToFilter].toLowerCase().indexOf(query.toLowerCase()) === 0) {
        if (result.indexOf(item[arrayToFilter]) === -1) {
          result.push(item[arrayToFilter]);
        }
      }
    });
    return result;
  }

  search(event, arrayToFilter) {
    this.autocomplete[arrayToFilter] = this.filter(event.query, arrayToFilter);
  }

  hmsToSeconds(str) {
    const p = str.split(':');
    let s = 0;
    let m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }
    return s;
  }

  secondsToHMS(inputSeconds) {
    const secondsNumber = parseInt(inputSeconds, 10);
    let hours: any = Math.floor(secondsNumber / 3600);
    let minutes: any = Math.floor((secondsNumber - (hours * 3600)) / 60);
    let seconds: any = secondsNumber - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

  reset() {
    this.searchFormInit();
    this.toogleButtonPeriod = 7;
    this.discard();
  }

}
