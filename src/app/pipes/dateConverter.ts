import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';

@Pipe({ name: 'dateConvert' })

export class DateConvert implements PipeTransform {
    transform(value: string): string {
        if (value) {
            const date = moment(value);
            if (date.isValid()) {
                const newDate = value.replace('T', ' ').replace('.000Z', '');
                return newDate;
                // return `${moment(momentTZ(value)).format('YYYY-MM-DD HH:mm:ss')} (CST)`;
            }
        }
    }
}
