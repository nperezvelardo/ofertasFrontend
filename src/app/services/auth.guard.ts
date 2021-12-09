import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
//comprobamos si el usuario esta logado
export class AuthGuard implements CanActivate {

  public loggin: boolean;

  constructor(private cookies: CookieService){
    if(this.cookies.get('logueado') == 'si'){
      this.loggin = true;
    }else{
      this.loggin = false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loggin;
  }
  
}