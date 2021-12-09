import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es'; 

@Pipe({
    name: 'unique',
    pure: false
})
export class PipeUnique implements PipeTransform {
    transform(value: any): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, 'id');
        }
        return value;
    }
}