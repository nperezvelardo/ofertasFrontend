import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LogsService } from '../../services/logs.service';
import { Logs } from '../../models/logs';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers: [LogsService]
})
export class LogsComponent implements OnInit {

  public logs: Logs[];  //para obtener los logs disponibles en la base de datos
  page = 1; //pagina por defecto
  count = 0;
  pageSize = 10; //tamaño de tabla
  pageSizes = [10,20,40,100]; //items disponibles en el listado
  public total: boolean; //para saber si hay o no logs registrados
  public order: string = 'Usuario'; //establecemos el orden que vamos a usar
  reverse: boolean = false;  
  filterpost = '';
  filtroLogs = '';

  constructor(
    private _logService: LogsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getLogs();
  }

  /**
   * metodo para obtener todos los logs disponibles en la base de datos
   */
  getLogs(){
    this._logService.getLogs().subscribe(
      response => {
        if(response.status == 200){
          if(response.total_registros == 0){
            this.total = false;
          }else{
            this.logs = response.detalles;
            this.total = true;
          }
          
        }else{
          console.log(response.status);
        }

      }
    );
  }

  /**
   * metodo para eliminar todos los logs previa confirmacion
   */
  deleteLogs(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar todas las operaciones`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this._logService.deleteLogs().subscribe(
          response => {
            if(response.status == 200){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Las operaciones se han eliminado correctamente',
                showConfirmButton: false,
                timer: 3500
              })
              this.ngOnInit();
            }else{
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Las operaciones no se han eliminado correctamente',
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

  /**
   * metodo para eliminar un log previa confirmacion
   * @param id 
   */
  deleteLog(id){
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar la operacion`,
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this._logService.deleteLog(id).subscribe(
          response => {
            if(response.status == 200){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'La operacion se ha eliminado correctamente',
                showConfirmButton: false,
                timer: 3500
              })
              this.ngOnInit();
            }else{
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'La operacion no se ha eliminado correctamente',
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

  onTableDataChange(event){
    this.page = event;
    this.getLogs();
  }  

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getLogs();
  }

  /**
   * metodo para obtener el filtro que se usara en la tabla
   * @param event 
   */
  handlePerfilChange(event): void{
    if(event.target.value == "todos"){
      this.filtroLogs = '';
    }else{
      this.filtroLogs = event.target.value;
    }
  }

  /**
   * metodo para ordenar la tabla segun value
   * @param value 
   */
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  /**
   * metodo para generar un pdf con los logs
   */
  generarPDF(){
    html2canvas(document.getElementById('logs'), {
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
      doc.text('LISTADO DE OPERACIONES', 60, 60);
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${new Date().toISOString()}_logs.pdf`);
    });
  }

}
