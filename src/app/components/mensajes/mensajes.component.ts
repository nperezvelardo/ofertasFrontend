import { Component, OnInit } from '@angular/core';
import { MensajeService } from 'src/app/services/mensaje.service';
import { CookieService } from "ngx-cookie-service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Mensaje } from '../../models/mensaje';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css'],
  providers: [MensajeService, UsuarioService]
})
export class MensajesComponent implements OnInit {

  public mensajes: Mensaje[];  //para guardar todos los mensajes disponibles en la base de datos
  public mensajesUsuario: Mensaje[] = [];  //para guardar los mensajes del usuario 
  public user: Usuario[];  //lista de usuarios posibles como destino del mensaje
  page = 1; //numero de pagina
  count = 0;
  pageSize = 4;
  pageSizes = [4,6,8,10]; 
  public total: boolean;  //si existe o no registros en la base de datos
  public id; //id del usuario registrado
  public perfil: string; //perfil del usuario registrado
  public mensaje: string = "";  //mensaje que se muestra al usuario
  public usuario: string; //nombre del usuario registrado
  public nombreUser: Usuario[] = [];
  public Editor = ClassicEditor;
  public order: string = 'titulo';  //orden por defecto establecido
  reverse: boolean = false;  //para controlar orden ascendente o descendente
  loginForm: FormGroup;
  filterEmail = '';
  usuariosSeleccionados : any [] = [];  //usuarios seleccionados para enviar los mensajes

  constructor(
    private _mensajeService: MensajeService,
    private userService: UsuarioService,
    private cookies: CookieService,
  ) { 
    this.usuario = this.cookies.get('usuario');
    this.id = this.cookies.get('id');
    this.perfil = this.cookies.get('perfil');
  }

  ngOnInit(): void {
    //obtenemos usuarios activados para enviar mensajes
    this.userService.getUsersActivosSin(this.id).subscribe(
      result => {
        if(result.status == 200){
          this.user = result.detalles;
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
    this.getMensajes();  //obtenemos todos los mensajes
    this.loginForm = new FormGroup({
      'titulo' : new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
      'contenido' : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(1000)]),
      'destino': new FormControl(this.usuariosSeleccionados, [Validators.required]),
      'usuario': new FormControl(this.id),
    });
    
  }

  get titulo(){ return this.loginForm.get('titulo'); }
  get contenido(){ return this.loginForm.get('contenido'); }
  get destino(){ return this.loginForm.get('destino'); }

  /**
   * obtenemos todos los mensajes y los usuarios para saber de quien es cada mensaje
   */
  getMensajes(){
    this._mensajeService.getMensajes().subscribe(
      result => {
        if(result.status == 200){
          if(result.total_registros == 0){
            this.total = false;
          }else{
            this.mensajes = result.detalles;
            this.mensajes.forEach(element =>{
              if(element.destino == this.id){
                this.mensajesUsuario.unshift(element);
              }
            })
            
            this.userService.getUsers().subscribe(
              response => {
                if(response.status == 200){
                  this.nombreUser = response.detalles;
                }
              }
            )
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
  }

  /**
   * eliminamos un mensaje segun id previa confirmacion
   * @param id 
   */
  delete(id){
      Swal.fire({
        title: '¿Está seguro?',
        text: `Está seguro que desea borrar`,
        showConfirmButton: true,
        showCancelButton: true
      }).then( resp => {
        if ( resp.value ) {
          this._mensajeService.deleteMensaje(id).subscribe(
            response => {
              if(response.status == 200){
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'El mensaje se ha eliminado correctamente',
                  showConfirmButton: false,
                  timer: 3500
                })
                this.mensajesUsuario = [];
                this.ngOnInit();
              }else{
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: 'El mensaje no se ha eliminado correctamente',
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
   * metodo para obtener mensajes cuando cambiamos de pagina
   * @param event 
   */
  onTableDataChange(event){
    this.page = event;
    this.mensajesUsuario = [];
    this.getMensajes();
  } 
  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.mensajesUsuario = [];
    this.getMensajes();
  } 

  /**
   * enviamos mensaje a usuarios seleccionados
   */
  onSubmit(){
    this._mensajeService.createMensaje(this.loginForm).subscribe(
      response => {
        if(response.status == 200){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El mensaje se ha enviado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
          this.mensajesUsuario = [];
          this.usuariosSeleccionados = [];
          this.ngOnInit();
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'El mensaje no se ha enviado correctamente',
            showConfirmButton: false,
            timer: 3500
          })
          this.ngOnInit();
        }
      }
    )
  }

  /**
   * metodo para establecer el orden
   * @param value 
   */
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  /**
   * metodo para generar un pdf con los mensajes
   */
  generarPDF(){
    html2canvas(document.getElementById('mensajes'), {
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
      doc.text('LISTADO DE MENSAJES', 60, 60);
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${new Date().toISOString()}_mensajes.pdf`);
    });
  }

  /**
   * metodo para obtener usuarios seleccionados
   * @param val 
   */
  changeFn(val) {
    val.forEach(element => {
      this.usuariosSeleccionados.unshift(element.id);
    });
  }

}
