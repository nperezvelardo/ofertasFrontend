import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { CookieService } from "ngx-cookie-service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css'],
  providers: [UsuarioService]
})
export class RestablecerComponent implements OnInit {

  loginForm: FormGroup;
  user = Usuario; //usuario que reestablece
  error: boolean;  //si el usuario no está registrado
  activo: boolean;  //si el usuario no está activo
  distintas: boolean; //si las contraseñas son distintas

  constructor(
    private auth: UsuarioService, 
    private router: Router, 
    private cookies: CookieService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'nif' : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]{8,8}[A-Za-z]$")]),
      'usuario' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'password2': new FormControl(null, [Validators.required, Validators.minLength(5)]),

    });
  }

  get email(){ return this.loginForm.get('email'); }
  get nif(){ return this.loginForm.get('nif');}
  get usuario(){ return this.loginForm.get('usuario')};

  /**
   * metodo para restablecer contraseña
   */
  restablecer(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea restablecer su contraseña`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        if(this.loginForm.get('nif').value == '12345678C'){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'La contraseña ha sido actualizada',
            showConfirmButton: false,
            timer: 3500
          })
          this.loginForm.reset(); //reseteamos el formulario
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Los datos introducidos no son correctos',
            showConfirmButton: false,
            timer: 3500
          })
        }
      }
    });
  }

}
