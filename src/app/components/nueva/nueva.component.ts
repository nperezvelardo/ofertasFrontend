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
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.css'],
  providers: [OfertaService, CicloService, FamiliaService]
})
export class NuevaComponent implements OnInit {

  public ciclos : Ciclos [] = []; //para obtener los ciclos formativos disponibles
  public familias: Familia;  //para obtener las familias profesionales disponibles
  public cicOferta: CiclosO;  
  public Editor = ClassicEditor;
  loginForm: FormGroup;
  public usuario: string; //nombre del usuario registrado
  ciclosSeleccionados : any [] = []; //para obtener los ciclos seleccionados
  //archivo pdf que vamos a registrar de la oferta
  archivo = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null
  }

  constructor(
    private _ciclo : CicloService,
    private _familia : FamiliaService,
    private _ofertaService: OfertaService,
    private cookies: CookieService,
  ) {
    this.usuario = this.cookies.get('usuario'); //obtenemos el usuario registrado
   }

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
    //obtenemos los ciclos formativos disponibles
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
      'empresa' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'informacion' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]),
      'usuario': new FormControl(this.usuario),
      'ciclos' : new FormControl(this.ciclosSeleccionados, [Validators.required]),
      'archivo' :new FormControl(null, [Validators.required]),
    });
  }

  get empresa(){ return this.loginForm.get('empresa'); }
  get informacion(){ return this.loginForm.get('informacion'); }

  //enviamos datos de la oferta que vamos a registrar y la insertamos en la base de datos
  onSubmit(){
    this._ofertaService.createOferta(this.loginForm).subscribe(
      response => {
        if(response.status == 200){
          this._ofertaService.uploadFile(this.archivo).subscribe(
            resp => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'La oferta se ha creado correctamente',
                showConfirmButton: false,
                timer: 3500
              })
              this.ngOnInit();
            }
          );
          
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'La oferta no se ha creado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
        }
      }
    )
  }

  /**
   * metodo que establece los codigos formativos segun familia profesional seleccionada
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
   * metodo para obtener el archivo pdf de la oferta seleccionado
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
}

