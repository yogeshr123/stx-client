import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sparkConfigFilter',
    pure: false
})
export class SparkConfigFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.LOAD_TYPE.indexOf(filter.LOAD_TYPE) !== -1);
    }
}