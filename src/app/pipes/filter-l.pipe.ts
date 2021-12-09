import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterL'
})
export class FilterLPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if(post.Accion.indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    return resultPosts;
  }


}
