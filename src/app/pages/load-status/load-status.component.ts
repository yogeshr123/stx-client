import { Component, OnInit } from '@angular/core';
import { LoadStatusService } from 'src/app/services/load-status.service';
import { DayPilot } from 'daypilot-pro-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-load-status',
  templateUrl: './load-status.component.html',
  styleUrls: ['./load-status.component.css']
})
export class LoadStatusComponent implements OnInit {

  searchForm: FormGroup;
  config: any = {
    timeHeaders: [{ groupBy: 'Day', format: 'dddd, d MMMM yyyy' }, { groupBy: 'Hour', format: 'H' }],
    scale: 'Hour',
    startDate: '2019-06-19',
    cellWidth: 25,
    TaskResizing: 'Disabled',
    days: 2,
    onTaskMove: args => {
      this.checkMovedTaskValidation(args);
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
    STATUS: []
  };
  toogleButton = 7;

  constructor(
    private messageService: MessageService,
    private loadStatusService: LoadStatusService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.searchFormInit();
    this.getTasks();
  }

  searchFormInit() {
    this.searchForm = this.formBuilder.group({
      SCHEMA_NAME: '',
      TABLE_NAME: '',
      STATUS: '',
      AVG_TIME: 7
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

  onSubmit() {
    const formValues = this.searchForm.value;
    delete formValues.AVG_TIME;
    for (const propName in formValues) {
      if (!formValues[propName]) {
        delete formValues[propName];
      } else {
        formValues[propName] = formValues[propName].toUpperCase();
      }
    }
    if (Object.keys(formValues).length > 0 && formValues.constructor === Object) {
      this.taskData = this.getSearchResult(formValues);
      this.setGanttValues();
    }
  }

  setGanttValues() {
    // console.log('item.LOAD_START_DATE ', this.taskData[1].LOAD_START_DATE, new Date(this.taskData[1].LOAD_START_DATE));
    this.taskData.map(item => {
      let barColor = '#bbb';
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
      item.start = item.LOAD_START_DATE;
      item.complete = 100;
      item.end = item.LOAD_END_DATE;
      item.text = `${item.SCHEMA_NAME}.${item.TABLE_NAME}.${item.ENV_NAME}`;
      item.id = item.DAG_RUN_ID;
      item.box = {
        resizeDisabled: true,
        html: `<b title="Status: ${item.STATUS}">${item.DAG_NAME}</b>`,
        htmlRight: `<span class="statusCircle ${item.STATUS}" title="Status: ${item.STATUS}"></span> <span>Avg. Time: 3 hr 30 min</span>`,
        toolTip: `Status: ${item.STATUS}`,
        barColor,
        contextMenu: new DayPilot.Menu({
          items: [
            {
              text: item.ETL_status === 'HOLD' ? `ETL: RESUME` : 'ETL: HOLD',
              icon: 'icon',
              onClick: args => {
                args.item.text = args.item.text === 'ETL: HOLD' ? 'ETL: RESUME' : 'ETL: HOLD';
                this.tasksMoved = true;
                if (args.item.icon.indexOf('icon-green') > -1) {
                  args.item.icon = 'icon';
                } else {
                  args.item.icon = 'icon icon-green';
                }
                args.source.data.ETL_status = args.item.text === 'ETL: HOLD' ? 'RESUME' : 'HOLD';
                args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
                args.source.data.updated = true;
              }
            },
            {
              text: item.T1_status === 'HOLD' ? `T1: RESUME` : 'T1: HOLD',
              icon: 'icon',
              onClick: args => {
                args.item.text = args.item.text === 'T1: HOLD' ? 'T1: RESUME' : 'T1: HOLD';
                this.tasksMoved = true;
                if (args.item.icon.indexOf('icon-blue') > -1) {
                  args.item.icon = 'icon';
                } else {
                  args.item.icon = 'icon icon-blue';
                }
                args.source.data.T1_status = args.item.text === 'T1: HOLD' ? 'RESUME' : 'HOLD';
                args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
                args.source.data.updated = true;
              }
            },
            {
              text: item.T2_status === 'HOLD' ? `T2: RESUME` : 'T2: HOLD',
              icon: 'icon',
              onClick: args => {
                args.item.text = args.item.text === 'T2: HOLD' ? 'T2: RESUME' : 'T2: HOLD';
                this.tasksMoved = true;
                if (args.item.icon.indexOf('icon-yellow') > -1) {
                  args.item.icon = 'icon';
                } else {
                  args.item.icon = 'icon icon-yellow';
                }
                args.source.data.T2_status = args.item.text === 'T2: HOLD' ? 'RESUME' : 'HOLD';
                args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
                args.source.data.updated = true;
              }
            }
          ]
        })
      };
    });
    this.config.tasks = this.taskData;
  }

  getTasks() {
    this.loader.tasks = true;
    this.loadStatusService.getTasks().subscribe((data: any) => {
      this.taskData = data.data;
      this.taskDataBackUp = this.taskData;
      if (this.taskData && this.taskData.length) {
        this.taskData.length = this.taskData.length < 10 ? this.taskData.length : 10;
        this.setGanttValues();
        this.loader.tasks = false;
      }
    }, error => {
      this.loader.tasks = false;
    });
  }

  changeLimit(limit) {
    const selectedLimit = parseInt(limit, 10);
    this.taskData = JSON.parse(JSON.stringify(this.taskDataBackUp));
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
    this.toogleButton = 7;
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
    if (newStartDate < currentStartDate) {
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
      if (item[arrayToFilter].toLowerCase().indexOf(query.toLowerCase()) === 0) {
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

}
