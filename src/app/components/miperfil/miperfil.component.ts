import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ChildrenOutletContexts } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CiclosU } from 'src/app/models/ciclosU';
import { CookieService } from "ngx-cookie-service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css'],
  providers: [UsuarioService]
})
export class MiperfilComponent implements OnInit {

  public usuario: Usuario;  //usuario que vamos a obtener
  public ciclos: CiclosU[] = [];  //ciclos del usuario
  public nombreCiclo : string[] = [];  //nombre de los ciclos del usuario
  public perfil: string;  //perfil del usuario registrado
  public idU;  //id del usuario registrado
  url: SafeResourceUrl;
  public id; //id para imprimir el archivo

  constructor(
    private usersService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute,
    private cookies: CookieService,
    private sanitizer: DomSanitizer
  ) { 
    //obtenemos valores de las cookies
    this.perfil = this.cookies.get('perfil');
    this.idU = this.cookies.get('id');
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params.id;  //obtenemos el id que nos devuelve la ruta
      this.cookies.set('idUsuarioActualizar', this.id);  //establecemos el id para comprobar que solo se actualice su usuario
      this.getUser(this.id); //llamamos al metodo para obtener el usuario pasando el id recogido
      }
    );
    
  }

  /**
   * obtenemos el usuario
   * @param id 
   */
  getUser(id){
    this.usersService.getUser(id).subscribe(
      result => {
        if(result.status == 200){
          this.usuario = result.detalles;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.detalles['pdf']);
          this.usersService.getCiclos(id).subscribe(
            resultado => {
              if(resultado.status == 200){
                this.ciclos = resultado.detalles;
                this.ciclos.forEach(element => {
                  this.usersService.getNombreCiclo(element.CodigoCiclo).subscribe(
                    response => {
                      if(response.status == 200){
                        this.nombreCiclo.unshift(response.detalles);
                      }
                    }
                  )
                  
                });
              }
            }
          )
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
  }

  /**
   * metodo para ver el archivo pdf en una ventana modal
   * @param url 
   */
  openModal(url){
    $('#modal').show;
    $('#modalpdf').attr('src', url);
  }

}
