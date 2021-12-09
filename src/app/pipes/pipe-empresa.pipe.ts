import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es'; 

@Pipe({
  name: 'pipeEmpresa',
  pure: false
})
export class PipeEmpresaPipe implements PipeTransform {

  transform(value: any): any{
    if(value!== undefined && value!== null){
        return _.uniqBy(value, 'empresa');
    }
    return value;
}

}
