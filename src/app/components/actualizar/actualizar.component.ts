import { Component, OnInit } from '@angular/core';
import { OfertaService } from 'src/app/services/oferta.service';
import { Oferta } from 'src/app/models/oferta';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { CicloService } from 'src/app/services/ciclo.service';
import { FamiliaService } from 'src/app/services/familia.service';
import Swal from 'sweetalert2';
import { Ciclos } from '../../models/ciclo';
import { Familia } from '../../models/familia';
import { CiclosO } from '../../models/ciclosO';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css'],
  providers: [OfertaService, CicloService, FamiliaService]
})
export class ActualizarComponent implements OnInit {

  public ciclos : Ciclos [] = [];  //ciclos formativos disponibles
  public _ciclos: CiclosO[] = []; //ciclos de la oferta
  public nombreCiclo : string[] = []; //nombre de los ciclos de la oferta
  public familias: Familia; //familias profesionales disponibles
  public cicOferta: CiclosO; 
  public Editor = ClassicEditor;
  public oferta : Oferta;  //oferta que obtenemos
  loginForm: FormGroup; 
  public usuario: string; //nombre del usuario registrado
  id;  //para saber el id de la oferta
  ciclosSeleccionados : any [] = [];  //para saber el ciclo seleccionado de la lista
  //archivo pdf para actulizar
  archivo = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null
  }

  constructor(
    private _ciclo : CicloService,
    private _familia : FamiliaService,
    private _ofertaService: OfertaService,
    private _route: ActivatedRoute,
    private cookies: CookieService,
  ) {
    this.usuario = this.cookies.get('usuario');//obtenemos el nombre del usuario de la cookie
   }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
  		this.id = params.id; //obtenemos el id que nos devuelve la ruta

  		this.getOferta(this.id); //llamamos al método para obtener la oferta 
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
      'empresa' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'informacion' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      'usuario': new FormControl(this.usuario),
      'ciclos' : new FormControl(this.ciclosSeleccionados),
    });
  }

  get empresa(){ return this.loginForm.get('empresa'); }
  get informacion(){ return this.loginForm.get('informacion'); }

  
  /**
   * metodo para obtener la oferta según el id de la oferta
   * @param id 
   */
  getOferta(id){
    this._ofertaService.getOferta(id).subscribe(
      result => {
        if(result.status == 200){
          this.oferta = result.detalles;
          this._ofertaService.getCiclos(id).subscribe(
            resultado => {
              if(resultado.status == 200){
                this._ciclos = resultado.detalles;
                this._ciclos.forEach(element => {
                  this._ofertaService.getNombreCiclo(element.CodigoCiclo).subscribe(
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
   * metodo que actualiza una oferta previa confirmación
   */
  onSubmit(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea actualizar`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        if(this.archivo.nombreArchivo == null){
          this._ofertaService.updateOferta(this.loginForm, this.id).subscribe(
            response => {
              if(response.status == 200){
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'La oferta se ha actualizado correctamente',
                  showConfirmButton: false,
                  timer: 3500
                })
                this.ngOnInit;
              }else{
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: 'La oferta no se ha actualizado correctamente',
                  showConfirmButton: false,
                  timer: 3500
                })
                this.ngOnInit;
              }
            }
          )
        }else{
          this._ofertaService.updateOferta(this.loginForm, this.id).subscribe(
            response => {
              if(response.status == 200){
                this._ofertaService.updateFile(this.archivo, this.id).subscribe(
                  resp => {
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'La oferta se ha actualizado correctamente',
                      showConfirmButton: false,
                      timer: 3500
                    })
                    this.ngOnInit;
                  }
                );
              }else{
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: 'La oferta no se ha actualizado correctamente',
                  showConfirmButton: false,
                  timer: 3500
                })
                this.ngOnInit;
              }
            }
          )
        }
      }

    });
  }

  /**
   * obtenemos los ciclos seleccionados en la lista
   * @param val 
   */
  changeFn(val) {
    val.forEach(element => {
      this.ciclosSeleccionados.unshift(element.Codigo);
    });
  }

  /**
   * obtenemos los ciclos según la familia profesionale elegida
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
   * obtenemos el archivo pdf para actualizar
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


}
