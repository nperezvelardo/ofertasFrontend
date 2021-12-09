import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [MensajeService, UsuarioService]
})
export class PrincipalComponent implements OnInit {

  public perfil: string;  //para obtener el perfil del usuario registrado
  public usuario: string;  //para obtener el nombre del usuario registrado
  public id:string;  //para obtener el id del usuario registrado
  public activos;
  public leidos;

  constructor(
    private _mensajeService: MensajeService,
    private cookies: CookieService,
    private usersService: UsuarioService,) { }

  ngOnInit(): void {
    //obtemos valores de las cookies
    this.perfil = this.cookies.get('perfil');
    this.usuario = this.cookies.get('usuario');
    this.id = this.cookies.get('id');
    //obtenemos usuarios no activados y mensajes
    this.usersService.getUserNoActivos().subscribe(
      result => {
        if(result.status == 200){
          if(result.detalles === 'No hay ningún usuario'){
            this.activos = 0;
          }else{
            this.activos = result.detalles;
          }
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
    //obtenemos usuarios no activados y mensajes
    this._mensajeService.getNoLeido(this.id).subscribe(
      result => {
        if(result.status == 200){
          if(result.detalles === 'No hay ningún usuario'){
            this.leidos = 0;
          }else{
            this.leidos= result.detalles;
          }
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
  }



}
