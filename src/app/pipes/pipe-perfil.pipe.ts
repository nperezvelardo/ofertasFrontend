import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es'; 

@Pipe({
  name: 'pipePerfil',
  pure: false
})
export class PipePerfilPipe implements PipeTransform {

  transform(value: any): any{
    if(value!== undefined && value!== null){
        return _.uniqBy(value, 'perfil');
    }
    return value;
}

}
