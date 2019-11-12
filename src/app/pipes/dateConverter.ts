import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';

@Pipe({ name: 'dateConvert' })

export class DateConvert implements PipeTransform {
    transform(value: string): string {
        if (value) {
            const date = moment(value);
            if (date.isValid()) {
                return `${moment(momentTZ(value)).format('YYYY-MM-DD HH:mm:ss')} (CST)`;
            }
        }
    }
}
