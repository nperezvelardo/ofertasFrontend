import { Component, OnInit } from '@angular/core';
import { MensajeService } from 'src/app/services/mensaje.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Mensaje } from '../../models/mensaje';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-detalle-m',
  templateUrl: './detalle-m.component.html',
  styleUrls: ['./detalle-m.component.css'],
  providers: [MensajeService, UsuarioService]
})
export class DetalleMComponent implements OnInit {

  public mensaje: Mensaje;  //para guardar el mensaje
  public nombreUser: Usuario[] = [];  //para guardar los usuarios
  public estado;

  constructor(
    private _mensajeService: MensajeService,
    private userService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params.id;  //obtenemos el id que nos devuelve la ruta
      this.getMensaje(id); //llamamos al metodo para obtener el mensaje pasando el id recogido
      //cambiamos mensaje a leido
      this._mensajeService.leido(id).subscribe(response => {
        if(response.status == 200){
          this.estado = response.detalles;
        }
      })
    });
    
  }

  /**
   * metodo que obtiene un mensaje según el id que pasemos por parametro
   * @param id 
   */
  getMensaje(id){
    this._mensajeService.getMensaje(id).subscribe(
      result => {
        if(result.status == 200){
          this.mensaje = result.detalles;
          this.userService.getUsers().subscribe(
            response => {
              if(response.status == 200){
                this.nombreUser = response.detalles;
              }
            }
          )
        }else{
          console.log(result.status);
        }
                 
      },
      error => {
          console.log(<any>error);
      }

    );
  }

}
