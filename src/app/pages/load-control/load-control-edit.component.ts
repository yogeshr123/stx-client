import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../services/record.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-loadcontroledit',
    templateUrl: './load-control-edit.component.html',
    styles: [':host{width: 100%; height: 100%;}']
})
export class LoadControlEditComponent implements OnInit {
    record: any;
    constructor(
        private recordService: RecordService,
        private router: Router
    ) {
    }
    ngOnInit() {
        this.recordService.currentRecord.subscribe(record => this.record = record);
        if (this.record) {

        }
        else {
            this.router.navigate(['/loadcontrol']);
        }
    }
}





