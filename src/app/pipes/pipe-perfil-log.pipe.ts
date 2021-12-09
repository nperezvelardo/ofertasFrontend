import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es'; 

@Pipe({
  name: 'pipePerfilLog',
  pure: false
})
export class PipePerfilLogPipe implements PipeTransform {

  transform(value: any): any{
    if(value!== undefined && value!== null){
        return _.uniqBy(value, 'perfil');
    }
    return value;
  }

}
