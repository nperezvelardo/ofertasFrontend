import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { LogsComponent } from './components/logs/logs.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { RegisterComponent } from './components/register/register.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { MiperfilComponent } from './components/miperfil/miperfil.component';
import { MensajesComponent } from './components/mensajes/mensajes.component';
import { DetalleMComponent } from './components/detalle-m/detalle-m.component';
import { ErrorComponent } from './components/error/error.component';
import { NuevaComponent } from './components/nueva/nueva.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { EditComponent } from './components/edit/edit.component';
import { RestablecerComponent } from './components/restablecer/restablecer.component';
import { CorreoComponent } from './components/correo/correo.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { UsuarioGuard } from './services/usuario.guard';

const routes: Routes = [
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'restablecer', component: RestablecerComponent},
    {path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard, AdminGuard ]},
    {path: 'ofertas', component: OfertasComponent, canActivate: [ AuthGuard ]},
    {path: 'correo', component: CorreoComponent, canActivate: [ AuthGuard ]},
    {path: 'principal', component: PrincipalComponent, canActivate: [ AuthGuard ]},
    {path: 'logs', component: LogsComponent, canActivate: [ AuthGuard,  AdminGuard ]},
    {path: 'mensajes', component: MensajesComponent, canActivate: [ AuthGuard ]},
    {path : 'usuarios/:id', component: MiperfilComponent, canActivate: [ AuthGuard ]},
    {path : 'ofertas/:id', component: DetalleComponent, canActivate: [ AuthGuard ]},
    {path: 'mensajes/:id', component: DetalleMComponent, canActivate: [ AuthGuard ]},
    {path : 'nueva', component: NuevaComponent, canActivate: [ AuthGuard, AdminGuard ]},
    {path : 'act/:id', component: ActualizarComponent, canActivate: [ AuthGuard, AdminGuard ]},
    {path : 'actuser/:id', component: EditComponent, canActivate: [ AuthGuard , UsuarioGuard]},
    {path: '**', component: ErrorComponent}   //cargamos página de error personalizada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
