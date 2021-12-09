import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroLogs'
})
export class FiltroLogsPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if(post.Perfil.indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    return resultPosts;
  }

}
