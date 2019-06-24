import { Component, OnInit } from '@angular/core';
import { LoadStatusService } from 'src/app/services/load-status.service';
import { DayPilot } from "daypilot-pro-angular";
import { FormBuilder, FormGroup } from '@angular/forms';


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
      // args.preventDefault();
      this.checkMovedTaskValidation(args);
    }
  };
  loader = {
    tasks: false,
    saveTasks: false
  };
  tasksMoved = false;
  taskData: any;
  taskDataBackUp: any;

  constructor(
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
      ENV_NAME: ''
    });
  }

  getSearchResult(formValues) {
    return this.taskDataBackUp.filter(item => {
      const notMatchingField = Object.keys(formValues)
        .find(key => item[key] !== formValues[key]);
      return !notMatchingField;
    });
  }

  onSubmit() {
    const formValues = this.searchForm.value;
    for (const propName in formValues) {
      if (!formValues[propName]) {
        delete formValues[propName];
      }
    }
    if (Object.keys(formValues).length > 0 && formValues.constructor === Object) {
      this.taskData = this.getSearchResult(formValues);
      this.setGanttValues(this.taskData);
    }

    //
    // const keys = Object.keys(formValues);
    // const filterUser = (user) => keys.every(key => user[key] === formValues[key]);

    // const someVar = this.taskData.filter(filterUser);
    // console.log("someVar ", someVar);
    //

    // if (formValues.SCHEMA_NAME || formValues.TABLE_NAME || formValues.ENV_NAME) {
    //   if (formValues.SCHEMA_NAME && !formValues.TABLE_NAME && !formValues.ENV_NAME) {
    //     this.taskData = this.taskData.filter((item) => {
    //       const caseInsensitiveSearch = new RegExp(
    //         `${formValues.SCHEMA_NAME.trim()}`,
    //         'i'
    //       );
    //       return caseInsensitiveSearch.test(item.SCHEMA_NAME);
    //     });
    //   } else if (!formValues.SCHEMA_NAME && formValues.TABLE_NAME && !formValues.ENV_NAME) {
    //     this.taskData = this.taskData.filter((item) => {
    //       const caseInsensitiveSearch = new RegExp(
    //         `${formValues.TABLE_NAME.trim()}`,
    //         'i'
    //       );
    //       return caseInsensitiveSearch.test(item.TABLE_NAME);
    //     });
    //   } else if (!formValues.SCHEMA_NAME && !formValues.TABLE_NAME && formValues.ENV_NAME) {
    //     this.taskData = this.taskData.filter((item) => {
    //       const caseInsensitiveSearch = new RegExp(
    //         `${formValues.ENV_NAME.trim()}`,
    //         'i'
    //       );
    //       return caseInsensitiveSearch.test(item.ENV_NAME);
    //     });
    //   }

    // }
    // this.setGanttValues(this.taskData);
    // console.log("this.taskData ", this.taskData);
  }

  setGanttValues(data) {
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
              text: `T1: ${item.T1_status}`,
              icon: 'icon',
              onClick: args => {
                // console.log("args ", args);
                args.item.text = args.item.text === 'Hold' ? 'Resume' : 'Hold';
                this.tasksMoved = true;
                if (args.item.icon.indexOf('icon-blue') > -1) {
                  args.item.icon = 'icon';
                } else {
                  args.item.icon = 'icon icon-blue';
                }
                args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
              }
            },
            {
              text: `T2: ${item.T2_status}`,
              icon: 'icon',
              onClick: args => {
                // console.log("args ", args);
                args.item.text = args.item.text === 'Hold' ? 'Resume' : 'Hold';
                this.tasksMoved = true;
                if (args.item.icon.indexOf('icon-yellow') > -1) {
                  args.item.icon = 'icon';
                } else {
                  args.item.icon = 'icon icon-yellow';
                }
                args.source.data.box.backColor = 'rgba(230, 109, 245, 1)';
              }
            }
          ]
        })
      };
    });
    // settings first row blank to ui look good
    this.taskData.unshift({ start: '2019-06-20T02:00:00', end: '2019-06-20', id: 0, text: '', complete: 0 });
    this.config.tasks = this.taskData;
  }

  getTasks() {
    this.loader.tasks = true;
    this.loadStatusService.getTasks().subscribe((data: any) => {
      this.taskData = data.data;
      this.taskDataBackUp = this.taskData;
      if (this.taskData && this.taskData.length) {
        this.setGanttValues(this.taskData);
        this.loader.tasks = false;
      }
    }, error => {
      console.log('error ', error);
      this.loader.tasks = false;
    });
  }

  discard() {
    this.getTasks();
    this.tasksMoved = false;
  }

  save() {
    this.loader.saveTasks = true;
    setTimeout(() => {
      this.loader.saveTasks = false;
      this.getTasks();
      this.tasksMoved = false;
    }, 2000);
  }

  checkMovedTaskValidation(event) {
    const args = event.e.data;
    // console.log("args ", args.start.value || args.start);
    // let newStartDate = args.start.value || args.start;
    // if (newStartDate.indexOf('000Z') === -1) {
    //   newStartDate = newStartDate + '.000Z';
    // }
    // console.log("newStartDate ", newStartDate);
    // newStartDate = new Date(newStartDate);
    // const currentStartDate = new Date(this.config.startDate);
    // console.log("currentStartDate ", currentStartDate);
    // console.log("newStartDate.getDate() ", newStartDate.getDate());
    // console.log("currentStartDate.getDate() ", currentStartDate.getDate());
    // if (currentStartDate.getDate() < newStartDate.getDate()) {
    //   event.preventDefault();
    // } else {
    this.tasksMoved = true;
    args.task.box.backColor = 'rgba(230, 109, 245, 1)';
    args.task.box.cssClass = 'movedItem';
    // this.updateHappended();
    // }
  }

}
