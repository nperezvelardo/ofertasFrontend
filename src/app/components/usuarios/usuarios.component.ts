import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgForm, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[] = []; //listado de usuarios registrados
  page = 1; //pagina por defecto para el listado
  count = 0;
  pageSize = 6;  //items en cada pagina
  pageSizes = [6,8,10,15];  //listado de items disponibles
  public order: string = 'Nombre';  //orden establecido por defecto
  reverse: boolean = false;  //para establecer orden ascendente o descendente
  filterpost = '';
  filtroperfil = '';
  correo : FormGroup;
  userCorreo;
  public status : string;  //estado de la respuesta
  //archivo excel para importar usuarios
  archivo = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null
  }
  public importado : string;
  loginForm: FormGroup;

  constructor(
    private usersService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUsers(); //obtenemos el listado de usuarios
    this.loginForm = new FormGroup({
      'archivo' :new FormControl(null, [Validators.required]),
    });
  }

  /**
   * metodo para obtener el listado de usuarios disponibles
   */
  getUsers(){
    this.usersService.getUsers().subscribe(
      result => {
        
        if(result.status == 200){
          this.usuarios = result.detalles;
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
  }

  /**
   * metodo para eliminar un usuario previa confirmacion
   * @param id 
   */
  deleteUser(id: string){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.usersService.deleteUsers(id).subscribe(
          response => {
            if(response.status == 200){
              Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'El usuario se ha eliminado correctamente',
                  showConfirmButton: false,
                  timer: 3500
                })
              this.ngOnInit();
            }else{
              Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: 'El usuario no se ha eliminado correctamente',
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
   * metodo para activar un usuario, una vez activado se le enviará un correo para comunicarselo
   * @param id 
   */
  activarUser(id: string){
    this.usersService.getUser(id).subscribe(
      result => {
        if(result.status == 200){
          this.userCorreo = result.detalles['email'];
          Swal.fire({
            title: '¿Está seguro?',
            text: `Está seguro que desea activar`,
            showConfirmButton: true,
            showCancelButton: true
          }).then( resp => {
      
            if ( resp.value ) {
              this.usersService.activarUsers(id).subscribe(
                response => {
                  if(response.status == 200){
                    this.usersService.enviarEmail(this.userCorreo).subscribe(
                      res => {
                        if(res.status == 200){
                          Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'El usuario se ha activado correctamente',
                            showConfirmButton: false,
                            timer: 3500
                          })
                          this.ngOnInit();
                        }else{
                          Swal.fire({
                              position: 'top-end',
                              icon: 'warning',
                              title: 'El usuario no se ha activado correctamente',
                              showConfirmButton: false,
                              timer: 3500
                            })
                          this.ngOnInit();
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
      
          });
        }      
      },
      error => {
          console.log(<any>error);
      }

    );
  }

  /**
   * metodo para mostar los items al cambiar de pagina
   * @param event 
   */
  onTableDataChange(event){
    this.page = event;
    this.getUsers();
  }  

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getUsers();
  }

  /**
   * metodo para establecer el filtro
   * @param event 
   */
  handlePerfilChange(event): void{
    this.filtroperfil = event.target.value;
  }

  /**
   * metodo para generar un pdf del listado de usuarios
   */
  generarPDF(){
    html2canvas(document.getElementById('usuarios'), {
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
      doc.text('LISTADO DE USUARIOS', 60, 60);
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${new Date().toISOString()}_usuarios.pdf`);
    });
  }

  /**
   * metodo para establecer el orden del listado
   * @param value 
   */
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  /**
   * metodo para seleccionar el archivo excel a importar
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
   * metodo para importar el archivo excel que hemos seleccionado
   */
  importar(){
    this.usersService.importFile(this.archivo).subscribe(
      (response) => {
          this.importado = "success";
          this.ngOnInit();
      }
    )
  }
  
  /**
   * metodo para desactivar un usuario
   * @param id 
   */
  desactivarUser(id: string){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea desactivar`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.usersService.desactivarUsers(id).subscribe(
          response => {
              if(response.status == 200){
                  Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'El usuario se ha desactivado correctamente',
                      showConfirmButton: false,
                      timer: 3500
                    })
                  this.ngOnInit();
              }else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'El usuario no se ha desactivado correctamente',
                    showConfirmButton: false,
                    timer: 3500
                  })
                this.ngOnInit();
              }
          }
        );
      }
    });
  }

}
