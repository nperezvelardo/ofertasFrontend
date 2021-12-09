import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { OfertaService } from 'src/app/services/oferta.service';
import { CookieService } from "ngx-cookie-service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css'],
  providers: [OfertaService]
})
export class CorreoComponent implements OnInit {

  loginForm: FormGroup;
  public email; //email del usuario registrado
  public Editor = ClassicEditor;

  constructor(
      private _ofertaService: OfertaService,
      private cookies: CookieService,
    ) { 
      this.email = this.cookies.get('emailUser');
    }
  
    ngOnInit(): void {
      this.loginForm = new FormGroup({
          'email' : new FormControl(null, [Validators.required, Validators.email]),
          'asunto' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
          'contenido' : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(250)]),
          'remitente': new FormControl(this.email),
        });
    }

      /**
   * enviamos mensaje a usuarios seleccionados
   */
  onSubmit(){
    this._ofertaService.enviarEmailUsuarios(this.loginForm).subscribe(
      response => {
        if(response.status == 200){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El correo electrónico se ha enviado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
          this.loginForm.reset(); //reseteamos el formulario
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'El correo electrónico no se ha enviado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
          this.ngOnInit();
        }
      }
    )
  }

}
