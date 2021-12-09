import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [UsuarioService]
})
export class NavbarComponent implements OnInit {

  public perfil: string;  //para establecer el perfil del usuario registrado
  public usuario: string; //para establecer el nombre del usuario registrado
  public id: string;  //para establecer el id del usuario registrado
  public hora: string;  //para establecer la hora en la que inició sesión
  public nombreUser: string; //para establecer el usuario

  constructor(
     private cookies: CookieService, 
     private router: Router,
     private auth: UsuarioService
   ) { }

  ngOnInit(): void {
    //obtenemos valores de cookies para saber usuario logado
    this.perfil = this.cookies.get('perfil');
    this.usuario = this.cookies.get('nombre');
    this.nombreUser = this.cookies.get('usuario');
    this.id = this.cookies.get('id');
    this.hora = this.cookies.get('hora');
  }

  /**
   * metodo para eliminar las cookies establecidas
   */
  logout(){
    this.auth.logOut(this.nombreUser).subscribe(
      (response) => { 
        if(response.status == 200){
           //eliminamos todas las cookies establecidas en la sesión
          this.cookies.delete("id");
          this.cookies.delete("perfil");
          this.cookies.delete("usuario");
          this.cookies.delete("nombre");
          this.cookies.delete("logueado");
          this.cookies.delete("emailUser");
          this.cookies.delete("hora");
          this.router.navigate(['/']);
        }
      }
    );
   
  }
  

}
