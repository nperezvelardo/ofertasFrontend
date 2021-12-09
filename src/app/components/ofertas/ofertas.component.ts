import { Component, OnInit } from '@angular/core';
import { OfertaService } from 'src/app/services/oferta.service';
import { Oferta } from 'src/app/models/oferta';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LogsService } from '../../services/logs.service';
import { Logs } from '../../models/logs';
import { CookieService } from "ngx-cookie-service";
import { CiclosU } from 'src/app/models/ciclosU';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css'],
  providers: [OfertaService, LogsService, UsuarioService]
})
export class OfertasComponent implements OnInit {

  public ofertas: Oferta[] = [];  //para obtener las ofertas
  public total: boolean; //para saber si hay o no ofertas
  public id: string;  //para obtener el id del usuario registrado
  public perfil: string; //para obtener el perfil del usuario registrado
  public operacion : Logs;  //para registrar la operacion realizada
  public usuario: string;  //para obtener el nombre del usuario registrado
  public ciclos: CiclosU[] = [];  
  public idO: number[] = [];
  public _id : number;  
  public usu: Usuario;
  public order: string = 'empresa';  //para obtener el orden por defecto
  reverse: boolean = false;  //para establecer el orden ascendente o descendente
  filterpost = '';
  @ViewChild('inputFile') inputFile: ElementRef;
  spinnerEnabled = false;
  keys: string[];
  isExcelFile: boolean;
  dataSheet = new Subject();
  page = 1;  //pagina por defecto
  count = 0;
  pageSize = 6;  //numero de items que aparecen en la tabla
  pageSizes = [6,8,10,15];  //items que se pueden seleccionar


  constructor(
    private _ofertaService: OfertaService,
    private user: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute,
    private cookies: CookieService,
    private logs : LogsService,
  ) { }

  ngOnInit(): void {
    //obtenemos datos de cookies
    this.usuario = this.cookies.get('usuario');
    this.id = this.cookies.get('id');
    this._id = +this.id;
    this.perfil = this.cookies.get('perfil');
    //obtenemos las ofertas del usuario
    this.getOfertas(this._id);
  }

  /**
   * metodo para obtener el listado de ofertas que están disponibles para el usuario logueado
   * @param id 
   */
  getOfertas(id){
    //comprobamos si el usuario es Admin o no para mostrar todas las ofertas o solo las que corresponden al usuario
    if(this.perfil == 'Admin'){
      this._ofertaService.getOfertas().subscribe(
        result => {
          if(result.status == 200){
            if(result.total_registros == 0){
              this.total = false;
            }else{
              this.ofertas = result.detalles;
              this.total = true;
            }
            
          }else{
            console.log(result.status);
          }
                   
        },
        error => {
            console.log(<any>error);
        }
  
      );
    }else{
      
      //obtenemos el id del usuario registrado
      this.user.getUser(id).subscribe(
        result => {
          if(result.status == 200){
            this.usu = result.detalles;
            //obtenemos los ciclos del usuario registrado
            this.user.getCiclos(id).subscribe(
              resultado => {
                if(resultado.status == 200){
                  this.ciclos = resultado.detalles;
                  
                  //recorremos todos los ciclos del usuario para obtener las ofertas de los ciclos del usuario que se ha registrado
                  this.ciclos.forEach(element =>{

                    //para cada código de la oferta solicitamos la información del ciclo al completo
                    this._ofertaService.getCodigo(element.CodigoCiclo).subscribe(
                      result => {
                        if(result.status == 200){
                          this.idO = result.detalles;   

                          this.idO.forEach(element => {
                            this._ofertaService.getOferta(element).subscribe(
                              result => {
                                if(result.status == 200){
                                  if(result.total_registros == 0){
                                    this.total = false;
                                  }else{
                                  this.total = true;
                                  this.ofertas.unshift(result.detalles); //añadimos cada oferta a la coleccion de ofertas para mostrarlas en la vista
                                  }
                                  
                                }else{
                                  console.log(result.status);
                                }
                                        
                              },
                              error => {
                                  console.log(<any>error);
                              }
                        
                            );
                          }) 

                          
                        }
                      },
                      error => {
                          console.log(<any>error);
                      }
                
                    );
                  })
                  
                  
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
    
  }

  /**
   * metodo para eliminar la oferta seleccionada previa confirmacion
   * @param id 
   */
  deleteOferta(id){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this._ofertaService.deleteOferta(id).subscribe(
          response => {
            if(response.status == 200){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'La oferta se ha eliminado correctamente',
                showConfirmButton: false,
                timer: 3500
              })
              this.ngOnInit();
            }else{
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'La oferta no se ha eliminado correctamente',
                showConfirmButton: false,
                timer: 3500
              })
              this.ngOnInit();
            }
              
          },
          error => {
            console.log(<any>error);
          }
        );
      }
    });
    
  }

  /**
   * metodo para obtener el perfil del usuario
   * @returns 
   */
  getPerfil(){
    return this.cookies.get('perfil');
  }

  /**
   * metodo para obtener ofertas al cambiar de pagina
   * @param event 
   */
  onTableDataChange(event){
    this.page = event;
    this.getOfertas(this._id);
  }  

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getOfertas(this._id);
  }

  handlePerfilChange(event): void{
    this.filterpost = event.target.value;
  }

  /**
   * metodo para obtener pdf de las ofertas
   */
  generarPDF(){
    html2canvas(document.getElementById('ofertas'), {
      allowTaint: true,
      useCORS: false,
      scale: 1
    }).then(function(canvas){
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 80;
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.text('LISTADO DE OFERTAS', 60, 60);
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${new Date().toISOString()}_ofertas.pdf`);
    });
  }

  /**
   * metodo para establecer el orden de la tabla
   * @param value 
   */
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

}
