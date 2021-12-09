import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
  })
  //comprobamos si el usuario a actualizar y el usuario logado es el mismo
  export class UsuarioGuard implements CanActivate {
  
    public loggin: boolean;
  
    constructor(private cookies: CookieService){
      if(this.cookies.get('id') == this.cookies.get('idUsuarioActualizar')){
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