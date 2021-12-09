import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { CicloService } from 'src/app/services/ciclo.service';
import { Ciclos } from '../../models/ciclo';
import { FamiliaService } from 'src/app/services/familia.service';
import { Familia } from '../../models/familia';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [CicloService, UsuarioService, FamiliaService]
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup;
  user = Usuario;  //usuario que se registrado
  public registrado : string;  //para comprobar si esta registrado
  public ciclos : Ciclos [] = [];  //para obtener todos los ciclos formativos disponibles
  public familias: Familia;  //para obtener todas las familias profesionales disponibles
  seleccionados:string[]=[];
  ciclosSeleccionados : any [] = [];  //para saber los ciclos seleccionados
  //para el archivo pdf del curriculum que vamos a registrar
  archivo = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null
  }
  imagen = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null
  }
  public emailU; //email del usuario que se va a registrar
  
  constructor(
    private _ciclo : CicloService,
    private _familia : FamiliaService,
    private auth: UsuarioService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    //obtenemos las familias profesionales
    this._familia.getFamilia().subscribe(
      result => {
        if(result.status == 200){
          this.familias = result.detalles;
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
    //obtenemos los ciclos formativos
    this._ciclo.getCiclos(1).subscribe(
      result => {
        if(result.status == 200){
          this.ciclos = result.detalles;
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
    this.loginForm = new FormGroup({
      'nif' : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]{8,8}[A-Za-z]$")]),
      'usuario' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'nombre' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
      'apellido1' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
      'apellido2' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      'telefono' : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]),
      'web' : new FormControl(null, [Validators.required, Validators.minLength(0), Validators.maxLength(50)]),
      'blog' : new FormControl(null, [Validators.required, Validators.minLength(0), Validators.maxLength(50)]),
      'github' : new FormControl(null, [Validators.required, Validators.minLength(0), Validators.maxLength(50)]),
      'promocion' : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]),
      'ciclos' : new FormControl(this.ciclosSeleccionados, [Validators.required]),
      'archivo' :new FormControl(null, [Validators.required]),
      'empresas' : new FormControl(false),
      'imagen' :new FormControl(null, [Validators.required]),
    });
  }

  get email(){ return this.loginForm.get('email'); }
  get password(){ return this.loginForm.get('password'); }
  get nif(){ return this.loginForm.get('nif');}
  get nombre(){ return this.loginForm.get('nombre');}
  get apellido1(){ return this.loginForm.get('apellido1');}
  get apellido2(){ return this.loginForm.get('apellido2');}
  get usuario(){ return this.loginForm.get('usuario')};
  get telefono(){ return this.loginForm.get('telefono')};
  get web(){ return this.loginForm.get('web')};
  get blog(){ return this.loginForm.get('blog')};
  get github(){ return this.loginForm.get('github')};
  get promocion(){ return this.loginForm.get('promocion')};

  /**
   * metodo para registrar un usuario
   */
  register(){
    this.auth.registerUser(this.loginForm).subscribe(
      (response) => { 
        if(response.status == 200){
          this.auth.uploadFile(this.archivo).subscribe(
            (resp) => {
              this.auth.uploadImagen(this.imagen).subscribe(
                (respu) => {
                  this.auth.enviarEmailRegistro().subscribe(
                      res => {
                        if(res.status == 200){
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'El usuario se ha creado correctamente',
                            showConfirmButton: false,
                            timer: 3500
                          })
                          this.loginForm.reset(); //reseteamos el formulario
                        }
                      }
                  );
                }
              );
            }
          );
        }else{
          if(response.status == 404){
            this.registrado = response.detalle;
          }
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'El usuario no se ha creado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
        }
      }
    );
    
  }

  /**
   * metodo para cambiar el listado de ciclos formativos segun familia profesional seleccionada
   * @param codigoFam 
   */
  onSelect(codigoFam){
    this.ciclos = [];
    this._ciclo.getCiclos(codigoFam).subscribe(
      result => {
        if(result.status == 200){
          this.ciclos = result.detalles;
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
  }

  /**
   * metodo para obtener los ciclos formativos seleccionados
   * @param val 
   */
  changeFn(val) {
    val.forEach(element => {
      this.ciclosSeleccionados.unshift(element.Codigo);
    });
  }

  /**
   * metodo para seleccionar el archivo pdf 
   * @param event 
   */
  fileChangeEvent(event) {
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;

    if(files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  /**
  * funcion que guarda los datos del fichero
  * @param readerEvent 
  */
  _handleReaderLoaded(readerEvent) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

  /**
   * funcion que extrae del evento la informacion del fichero seleccionado
   * @param event 
   */
  subirImagen(event: any){
    var files = event.target.files;
    var file = files[0];
    this.imagen.nombreArchivo = file.name;

    if (files && file){
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);

    }
  }
 
  /**
  * funcion que guarda los datos del fichero
  * @param readerEvent 
  */
  handleReaderLoaded(readerEvent: any){
    var binaryString = readerEvent.target.result;
    this.imagen.base64textString = btoa(binaryString);
  }
 

}
