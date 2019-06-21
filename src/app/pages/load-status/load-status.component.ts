import { Component, OnInit } from '@angular/core';
import { LoadStatusService } from 'src/app/services/load-status.service';

@Component({
  selector: 'app-load-status',
  templateUrl: './load-status.component.html',
  styleUrls: ['./load-status.component.css']
})
export class LoadStatusComponent implements OnInit {

  config: any = {
    timeHeaders: [{ groupBy: 'Day', format: 'dddd, d MMMM yyyy' }, { groupBy: 'Hour' }],
    scale: 'Hour',
    startDate: '2019-06-19',
    cellWidth: 35,
    TaskResizing: 'Disabled',
    days: 2,
    onTaskMoved: args => {
      // console.log('Task onTaskMoved', args.e.data);
    },
    onTaskMove: args => {
      // console.log('Task onTaskMove', args.e.data);
    }
  };
  isLoading = false;

  constructor(
    private loadStatusService: LoadStatusService
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.isLoading = true;
    this.loadStatusService.getTasks().subscribe((data: any) => {
      const taskData = data.data;
      if (taskData && taskData.length) {

        taskData.map(item => {
          item.start = item.LOAD_START_DATE;
          item.complete = 100;
          item.end = item.LOAD_END_DATE;
          item.text = `${item.SCHEMA_NAME}.${item.TABLE_NAME}.${item.ENV_NAME}`;
          item.id = item.DAG_RUN_ID;
          item.box = {
            resizeDisabled: true,
            html: `<b>${item.SCHEMA_NAME}.${item.TABLE_NAME}.${item.ENV_NAME}</b>`
          };
        });
        taskData.unshift({ start: '2019-06-20T02:00:00', end: '2019-06-20', id: 0, text: '', complete: 0 });
        this.config.tasks = taskData;
        this.isLoading = false;
      }
    }, error => {
      console.log('error ', error);
      this.isLoading = false;
    });
  }

}
