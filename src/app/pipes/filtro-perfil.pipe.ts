import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPerfil'
})
export class FiltroPerfilPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if(post.perfil.indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    return resultPosts;
  }

}
