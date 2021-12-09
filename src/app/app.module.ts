import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import {NgxPaginationModule} from 'ngx-pagination';
import { CookieService } from 'ngx-cookie-service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PipeUnique } from './pipes/pipeUnique.pipe';
import { OrderModule } from 'ngx-order-pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import {MatSelectModule} from '@angular/material/select';
import { NgSelectModule } from "@ng-select/ng-select";
import{ init } from 'emailjs-com';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { LogsComponent } from './components/logs/logs.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { RegisterComponent } from './components/register/register.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ErrorComponent } from './components/error/error.component';
import { MiperfilComponent } from './components/miperfil/miperfil.component';
import { MensajesComponent } from './components/mensajes/mensajes.component';
import { NuevaComponent } from './components/nueva/nueva.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { EditComponent } from './components/edit/edit.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterUPipe } from './pipes/filter-u.pipe';
import { FilterLPipe } from './pipes/filter-l.pipe';
import { DetalleMComponent } from './components/detalle-m/detalle-m.component';
import { RestablecerComponent } from './components/restablecer/restablecer.component';
import { PaginatePipe } from './pipes/paginate.pipe';
import { PipePerfilPipe } from './pipes/pipe-perfil.pipe';
import { FiltroPerfilPipe } from './pipes/filtro-perfil.pipe';
import { FiltroLogsPipe } from './pipes/filtro-logs.pipe';
import { PipeEmpresaPipe } from './pipes/pipe-empresa.pipe';
import { PipePerfilLogPipe } from './pipes/pipe-perfil-log.pipe';
import { FilterEPipe } from './pipes/filter-e.pipe';
import { CorreoComponent } from './components/correo/correo.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    NavbarComponent,
    LoginComponent,
    LogsComponent,
    OfertasComponent,
    InicioComponent,
    DetalleComponent,
    RegisterComponent,
    PrincipalComponent,
    ErrorComponent,
    MiperfilComponent,
    MensajesComponent,
    PipeUnique,
    NuevaComponent,
    ActualizarComponent,
    EditComponent,
    FilterPipe,
    FilterUPipe,
    FilterLPipe,
    DetalleMComponent,
    RestablecerComponent,
    PaginatePipe,
    PipePerfilPipe,
    FiltroPerfilPipe,
    FiltroLogsPipe,
    PipeEmpresaPipe,
    PipePerfilLogPipe,
    FilterEPipe,
    CorreoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    NgxPaginationModule,
    CKEditorModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    OrderModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    SocialLoginModule, 
    MatSelectModule,
    NgSelectModule,
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '947878757600-43i7homn4d15oq4bgd1al5df4ug6kvu2.apps.googleusercontent.com'
          )
        }
      ]
    } as SocialAuthServiceConfig,
  } , 
  {
    provide: 'SocialAuthServiceConfig2',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(
            '570651957320084'
          )
        }
      ]
    } as SocialAuthServiceConfig,
  },      
    {provide: APP_BASE_HREF, useValue: '/'}, [CookieService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
