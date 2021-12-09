import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { CookieService } from "ngx-cookie-service";
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user = Usuario;  //usuario que se loguea
  error: boolean;  //por si se produce un error
  activo: boolean;  
  userGoogle: SocialUser;
  socialUser: SocialUser;  
  checkSeleccionado;  //para saber si estamos pulsando en recordar
  correo;  //para obtener el correo que tengamos en las cookies
  pass;  //para obtener la contraseña que tengamos en las cookies
  today= new Date();
  jstoday = '';

  constructor(
    private auth: UsuarioService, 
    private router: Router, 
    private cookies: CookieService,
    private socialAuthService: SocialAuthService,
    private socialAuthService2: SocialAuthService
  ) {
      this.jstoday = formatDate(this.today, 'hh:mm:ss a', 'en');
    }

  ngOnInit(): void {
    this.correo = this.cookies.get('email'); //obtenemos valor de email de cookies
    this.pass = this.cookies.get('password');  //obtenemos valor de password
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'recaptcha': new FormControl(null, [Validators.required]),
      'recordar' : new FormControl(true)
    });
  }

  get email(){ return this.loginForm.get('email'); }
  get password(){ return this.loginForm.get('password'); }

  /**
   * metodo para comprobar si el usuario conincide con uno registrado en la base de datos
   */
  login(){
    this.auth.logIn(this.loginForm).subscribe(
      (response) => { 
        if(response.status == 200){
          this.cookies.set('logueado', 'si');
          this.user = response.detalles;
          this.error = false;
          this.activo = false;
          this.cookies.set('id', response.detalles['id']);
          this.cookies.set('usuario', response.detalles['usuario']);
          this.cookies.set('nombre', response.detalles['nombre']);
          this.cookies.set('emailUser', response.detalles['email']);
          this.cookies.set('hora', this.jstoday);
          if(response.detalles['perfil'] == 'Admin'){
            this.cookies.set('perfil' , 'Admin');
          }else{
            this.cookies.set('perfil', 'User');
          }
          if (this.loginForm.value.recordar){
            this.cookies.set('email', response.detalles['email']);
            this.cookies.set('password', this.loginForm.value.password);
          }else{
            this.cookies.set('email', '');
            this.cookies.set('password', '');
          }
          this.router.navigate(['/principal']);
        }else if(response.status == 401){
          this.router.navigate(['/login']);
          this.activo = true;
          this.cookies.set('logueado', 'no');
        }else{
          this.router.navigate(['/login']);
          this.error = true;
          this.cookies.set('logueado', 'no');
        }
        
        
      }
    );
    
      
  }

  /**
   * metodo para logarse mediante google
   */
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.userGoogle = user;
      this.auth.logInGoogle(this.userGoogle.email).subscribe(
        (response) => { 
          if(response.status == 200){
            this.cookies.set('logueado', 'si');
            this.user = response.detalles;
            this.error = false;
            this.activo = false;
            this.cookies.set('id', response.detalles['id']);
            this.cookies.set('usuario', response.detalles['usuario']);
            this.cookies.set('nombre', response.detalles['nombre']);
            this.cookies.set('emailUser', response.detalles['email']);
            this.cookies.set('hora', this.jstoday);
            if(response.detalles['perfil'] == 'Admin'){
              this.cookies.set('perfil' , 'Admin');
            }else{
              this.cookies.set('perfil', 'User');
            }
            this.router.navigate(['/principal']);
          }else if(response.status == 401){
            this.router.navigate(['/login']);
            this.activo = true;
            this.cookies.set('logueado', 'no');
          }else{
            this.router.navigate(['/login']);
            this.error = true;
            this.cookies.set('logueado', 'no');
          }
          
          
        }
      );
    });
  }

  /**
   * metodo para logarse mediante facebook
   */
  loginWithFacebook(): void {
    this.socialAuthService2.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService2.authState.subscribe((user) => {
      this.socialUser = user;
      this.auth.logInGoogle(this.socialUser.email).subscribe(
        (response) => { 
          if(response.status == 200){
            this.cookies.set('logueado', 'si');
            this.user = response.detalles;
            this.error = false;
            this.activo = false;
            this.cookies.set('id', response.detalles['id']);
            this.cookies.set('usuario', response.detalles['usuario']);
            if(response.detalles['perfil'] == 'Admin'){
              this.cookies.set('perfil' , 'Admin');
            }else{
              this.cookies.set('perfil', 'User');
            }
            this.router.navigate(['/principal']);
          }else if(response.status == 401){
            this.router.navigate(['/login']);
            this.activo = true;
            this.cookies.set('logueado', 'no');
          }else{
            this.router.navigate(['/login']);
            this.error = true;
            this.cookies.set('logueado', 'no');
          }
          
          
        }
      );
    });
  }


}
