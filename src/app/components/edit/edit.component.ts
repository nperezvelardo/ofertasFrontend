import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { CicloService } from 'src/app/services/ciclo.service';
import { CiclosU } from 'src/app/models/ciclosU';
import { FamiliaService } from 'src/app/services/familia.service';
import { Familia } from '../../models/familia';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ciclos } from '../../models/ciclo';
import Swal from 'sweetalert2';
import { CookieService } from "ngx-cookie-service";
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [CicloService, UsuarioService, FamiliaService]
})
export class EditComponent implements OnInit {

  loginForm: FormGroup;
  public user : Usuario; //para obtener el usuario
  public registrado : string; //para comprobar si esta registrado
  public _ciclos: CiclosU[] = [];  //codigo de los ciclos del usuario
  public familias: Familia;  //familias profesionales disponibles
  public nombreCiclo : string[] = [];  //nombre de los ciclos del usuario
  public ciclos : Ciclos [] = [];  //ciclos formativos disponibles
  id;  //para saber el id del usuario registrado
  public perfil: string;  //para saber el perfil del usuario registrado
  ciclosSeleccionados : any [] = [];  //para obtener los ciclos seleccionados
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

  constructor(
    private _ciclo : CicloService,
    private usersService: UsuarioService,
    private _familia : FamiliaService,
    private _route: ActivatedRoute,
    private router: Router, 
    private cookies: CookieService,
  ) { }

  ngOnInit(): void {
    this.perfil = this.cookies.get('perfil'); //obtenemos el perfil del usuario
    this._route.params.subscribe(params => {
  		this.id = params.id;  //obtenemos el id que nos devuelve la ruta

      //obtenemos el usuario que vamos a actualizar
  		this.usersService.getUser(this.id).subscribe(
        result => {
          if(result.status == 200){
            this.user = result.detalles;
            this.usersService.getCiclos(this.id).subscribe(
              resultado => {
                if(resultado.status == 200){
                  this._ciclos = resultado.detalles;
                  this._ciclos.forEach(element => {
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
  	});
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
      'id': new FormControl(this.id),
      'nif' : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]{8,8}[A-Za-z]$")]),
      'usuario' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'nombre' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
      'apellido1' : new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(40)]),
      'apellido2' : new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(40)]),
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'telefono' : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]),
      'web' : new FormControl(null, [Validators.minLength(0), Validators.maxLength(50)]),
      'blog' : new FormControl(null, [Validators.minLength(0), Validators.maxLength(50)]),
      'github' : new FormControl(null, [Validators.minLength(0), Validators.maxLength(50)]),
      'promocion' : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]),
      'perfil' : new FormControl(this.perfil),
      'ciclos' : new FormControl(this.ciclosSeleccionados),
    });

  }

  get email(){ return this.loginForm.get('email'); }
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
   * metodo para obtener el usuario que vamos a actualizar
   * @param id 
   */
  getUser(id){
    this.usersService.getUser(id).subscribe(
      result => {
        if(result.status == 200){
          this.user = result.detalles;
          this.usersService.getCiclos(id).subscribe(
            resultado => {
              if(resultado.status == 200){
                this._ciclos = resultado.detalles;
                this._ciclos.forEach(element => {
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
   * metodo para obtener los ciclos formativos segun la familia profesional que seleccionemos
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
   * metodo que actualiza un usuario previa confirmacion
   */
  onSubmit(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea actualizar`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        if(this.archivo.nombreArchivo == null || this.imagen.nombreArchivo == null){
          if(this.archivo.nombreArchivo == null && this.imagen.nombreArchivo == null){
            this.usersService.actuser(this.loginForm, this.id).subscribe(
              response => {
                if(response.status == 200){
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'El usuario se ha actualizado correctamente',
                    showConfirmButton: false,
                    timer: 3500
                  })
                  this.loginForm.reset(); //reseteamos el formulario 
                }else{
                  Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: 'El usuario no se ha actualizado correctamente',
                      showConfirmButton: false,
                      timer: 3500
                    })
                }
              }
            );
          }else if(this.archivo.nombreArchivo == null){
            this.usersService.actuser(this.loginForm, this.id).subscribe(
              response => {
                if(response.status == 200){
                  this.usersService.updateImagen(this.imagen, this.id).subscribe(
                    (respu) => {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'El usuario se ha actualizado correctamente',
                        showConfirmButton: false,
                        timer: 3500
                      })
                      this.loginForm.reset(); //reseteamos el formulario 
                    }
                  );
                }else{
                  Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: 'El usuario no se ha actualizado correctamente',
                      showConfirmButton: false,
                      timer: 3500
                    })
                }
              }
            );
          }else if(this.imagen.nombreArchivo == null){
            this.usersService.actuser(this.loginForm, this.id).subscribe(
              response => {
                if(response.status == 200){
                  this.usersService.updateFile(this.archivo, this.id).subscribe(
                    (respu) => {
                      Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'El usuario se ha actualizado correctamente',
                        showConfirmButton: false,
                        timer: 3500
                      })
                      this.loginForm.reset(); //reseteamos el formulario 
                    }
                  );
                }else{
                  Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: 'El usuario no se ha actualizado correctamente',
                      showConfirmButton: false,
                      timer: 3500
                    })
                }
              }
            );
          }
        
        }else{
          this.usersService.actuser(this.loginForm, this.id).subscribe(
            response => {
              if(response.status == 200){
                this.usersService.updateFile(this.archivo, this.id).subscribe(
                  resp => {
                    this.usersService.updateImagen(this.imagen, this.id).subscribe(
                      (respu) => {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: 'El usuario se ha actualizado correctamente',
                          showConfirmButton: false,
                          timer: 3500
                        })
                        this.loginForm.reset(); //reseteamos el formulario 
                      }
                    );
                  }
                );
              }else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'El usuario no se ha actualizado correctamente',
                    showConfirmButton: false,
                    timer: 3500
                  })
              }
            }
          )
        }
      }

    });
    
  }

  /**
   * metodo para obtener los ciclos seleccionados
   * @param val 
   */
  changeFn(val) {
    val.forEach(element => {
      this.ciclosSeleccionados.unshift(element.Codigo);
    });
  }

  /**
   * obtenemos el archivo seleccionado
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
