import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { LoadStatusService } from 'src/app/services/load-status.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as frappeGantt from '../../../../lib/frappe-gantt';

import * as $ from 'jquery';
import { LoadControlService } from 'src/app/services/load-control.service';

@Component({
    selector: 'app-load-status',
    templateUrl: './load-status.component.html',
    styleUrls: ['./load-status.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadStatusComponent implements OnInit {
    searchForm: FormGroup;
    defaultDate: Date = new Date('Fri Jan 1 1970 00:00:00');
    loader = {
        tasks: false,
        saveTasks: false,
        gantt: false,
    };
    tasksMoved = false;
    taskData: any;
    taskDataBackUp: any;
    errors = {
        updateEror: false,
    };
    selectedRecordsLimit: any = 10;
    autocomplete = {
        SCHEMA_NAME: [],
        TABLE_NAME: [],
    };
    toogleButtonPeriod = 7;
    frappeGanttChart: any;
    @ViewChild('ganttChart', { static: false }) ganttChart: ElementRef;

    constructor(
        private loadControlService: LoadControlService,
        private messageService: MessageService,
        private loadStatusService: LoadStatusService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.searchFormInit();
        this.getTasks();
    }

    setFrappeGanttChart() {
        this.loader.gantt = true;
        const today = new Date();
        const year = today.getFullYear();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        this.taskData = this.taskData.map(i => {
            let calculatedEndTime: any = `${this.secondsToHMS(
                this.hmsToSeconds(i.START_TIME) + i.EXEC_TIME
            )}`;
            let hours: any = calculatedEndTime.substr(0, 2);
            const rest = calculatedEndTime.substr(2);
            if (hours > 24) {
                hours = hours - 24;
                calculatedEndTime = new Date(
                    `${year}-${month}-${date + 1} ${hours}${rest}`
                );
            } else {
                calculatedEndTime = new Date(
                    `${year}-${month}-${date} ${this.secondsToHMS(
                        this.hmsToSeconds(i.START_TIME) + i.EXEC_TIME
                    )}`
                );
            }
            i.id = i.DAG_RUN_ID;
            i.name = `${i.TABLE_NAME}`;
            i.startTime = i.START_TIME;
            i.start = new Date(`${year}-${month}-${date} ${i.START_TIME}`);
            i.end = calculatedEndTime;
            i.progress = (i.T1_EXEC / i.EXEC_TIME) * 100;
            i.htmlRight = {
                t1: `${this.secondsToHMS(i.T1_EXEC)} (${Math.round(
                    (i.T1_EXEC / i.EXEC_TIME) * 100
                )} %)`,
                t2: `${this.secondsToHMS(i.T2_EXEC)} (${Math.round(
                    (i.T2_EXEC / i.EXEC_TIME) * 100
                )} %)`,
                avg: `${this.secondsToHMS(i.EXEC_TIME)}`,
            };
            return i;
        });
        setTimeout(() => {
            this.frappeGanttChart = new frappeGantt.default(
                this.ganttChart.nativeElement,
                this.taskData,
                {
                    header_height: 40,
                    bar_height: 15,
                    custom_popup_html: task => {
                        // console.log("task ", task);
                        return `
            <div class="details-container">
              <h5>${task.name}</h5>
              <span>Start Time: ${task.startTime}</span>
              <span>T1 Time: ${task.htmlRight.t1}</span>
              <span>T2 Time: ${task.htmlRight.t2}</span>
              <span>Avg. Time: ${task.htmlRight.avg}</span>
            </div>
          `;
                    },
                    view_mode: 'Hour',
                    on_date_change: task => {
                        this.tasksMoved = true;
                        task.updated = true;
                    },
                }
            );
            this.getElementInfo();
            setTimeout(() => {
                this.loader.gantt = false;
            }, 500);
        }, 100);
    }

    getElementInfo() {
        $('span.space').css('height', $('.grid-header').height());
        $('span.dag-name').css('height', $('.grid-row').height());
        if (!$('.grid-header').height()) {
            $('span.space').css('height', 50);
            $('span.dag-name').css('height', 33);
        }
        $('.bar').on('click', () => {
            this.tasksMoved = true;
        });
    }

    searchFormInit() {
        this.searchForm = this.formBuilder.group({
            SCHEMA_NAME: '',
            TABLE_NAME: '',
            AVG_TIME: '',
            START_TIME: '',
            ENV_NAME: 'PRD',
        });
    }

    getSearchResult(formValues) {
        return this.taskDataBackUp.filter(item => {
            const notMatchingField = Object.keys(formValues).find(key => {
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
        if (
            (event && event.keyCode === 8 && !event.target.value) ||
            isAutoComplete ||
            event.target.value.length >= 3
        ) {
            const formValues = Object.assign({}, this.searchForm.value);
            delete formValues.AVG_TIME;
            delete formValues.START_TIME;
            for (const propName in formValues) {
                if (!formValues[propName]) {
                    delete formValues[propName];
                } else {
                    formValues[propName] = formValues[propName].toUpperCase();
                }
            }
            this.taskData = this.getSearchResult(formValues);
            // Filter for Start Time
            if (this.searchForm.value.START_TIME) {
                const filterStartTime = this.searchForm.value.START_TIME;
                this.taskData = this.taskData.filter(i => {
                    const taskStartTime = i.start;
                    return (
                        new Date(taskStartTime).getTime() >=
                        new Date(filterStartTime).getTime()
                    );
                });
            }
            // Filter for Avg Time
            if (this.searchForm.value.AVG_TIME) {
                const getExecInSecs = this.hmsToSeconds(
                    `${this.searchForm.value.AVG_TIME}:00:00`
                );
                this.taskData = this.taskData.filter(
                    i => i.EXEC_TIME >= getExecInSecs
                );
            }
            if (this.searchForm.value.ENV_NAME) {
                this.taskData = this.taskData.filter(
                    i => i.ENV_NAME === this.searchForm.value.ENV_NAME
                );
            }
            if (this.taskData && this.taskData.length) {
                if (this.taskData.length > this.selectedRecordsLimit) {
                    this.taskData.length = this.selectedRecordsLimit;
                }
                this.setFrappeGanttChart();
            }
        }
    }

    getTasks() {
        this.loader.tasks = true;
        this.loadStatusService.getTasks(this.toogleButtonPeriod).subscribe(
            (data: any) => {
                this.taskData = data.data;
                this.taskDataBackUp = JSON.parse(JSON.stringify(this.taskData));
                if (this.taskData && this.taskData.length) {
                    this.onSubmit(null, true);
                    this.changeLimit();
                }
                this.loader.tasks = false;
            },
            error => {
                this.loader.tasks = false;
            }
        );
    }

    changeLimit() {
        this.onSubmit(null, true);
    }

    discard() {
        // this.toogleButtonPeriod = 7;
        this.tasksMoved = false;
        this.getTasks();
    }

    save() {
        this.errors.updateEror = false;
        this.loader.saveTasks = true;
        const updatedTasks = this.taskData.filter(
            item => item.updated === true
        );
        updatedTasks.map(i => {
            if (i.DAG_SCHEDULE_INTERVAL && i._start) {
                let updatedInterval = i.DAG_SCHEDULE_INTERVAL.split(' ');
                const generateInterval = new Date(i._start);
                updatedInterval[1] = generateInterval.getHours();
                updatedInterval[0] = generateInterval.getMinutes();
                updatedInterval = updatedInterval.join(' ');
                i.DAG_SCHEDULE_INTERVAL = updatedInterval;
            }
            return i;
        });

        const request = {
            records: updatedTasks,
        };
        this.loadControlService.setSchedulerInterval(request).subscribe(
            (data: any) => {
                this.tasksMoved = false;
                this.loader.saveTasks = false;
                this.showToast('success', 'Scheduler interval saved.');
                this.getTasks();
            },
            error => {
                this.errors.updateEror = true;
                this.loader.saveTasks = false;
                this.showToast('error', 'Could not save Scheduler interval.');
            }
        );
    }

    filter(query, arrayToFilter) {
        const result = [];
        this.taskDataBackUp.filter(item => {
            if (
                item[arrayToFilter] &&
                item[arrayToFilter]
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) === 0
            ) {
                if (result.indexOf(item[arrayToFilter]) === -1) {
                    result.push(item[arrayToFilter]);
                }
            }
        });
        return result;
    }

    search(event, arrayToFilter) {
        this.autocomplete[arrayToFilter] = this.filter(
            event.query,
            arrayToFilter
        );
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
        let minutes: any = Math.floor((secondsNumber - hours * 3600) / 60);
        let seconds: any = secondsNumber - hours * 3600 - minutes * 60;

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    reset() {
        this.searchFormInit();
        this.toogleButtonPeriod = 7;
        this.discard();
    }

    showToast(severity, summary) {
        this.messageService.add({ severity, summary, life: 3000 });
    }
}
