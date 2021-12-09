import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ChildrenOutletContexts } from '@angular/router';
import { Oferta } from 'src/app/models/oferta';
import { OfertaService } from 'src/app/services/oferta.service';
import { CiclosO } from 'src/app/models/ciclosO';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare let $: any;


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  providers: [OfertaService]
})
export class DetalleComponent implements OnInit {

  public oferta: Oferta; //oferta que se obtiene
  public ciclos: CiclosO[] = []; //ciclos de la oferta
  public nombreCiclo : string[] = []; //nombre de los ciclos de la oferta
  url: SafeResourceUrl;
  
  constructor(
    private oferService: OfertaService,
    private _router: Router,
    private _route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params.id;  //obtenemos el id que nos devuelve la ruta
      this.getOferta(id); //llamamos al metodo para obtener la oferta pasando el id recogido
      }
    );
  }

  /**
   * metodo para obtener la oferta segun el id pasado por parametro
   * @param id 
   */
  getOferta(id){
      this.oferService.getOferta(id).subscribe(
        result => {
          if(result.status == 200){
            this.oferta = result.detalles;
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.detalles['pdf']);
            this.oferService.getCiclos(id).subscribe(
              resultado => {
                if(resultado.status == 200){
                  this.ciclos = resultado.detalles;
                  this.ciclos.forEach(element => {
                    this.oferService.getNombreCiclo(element.CodigoCiclo).subscribe(
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
   * metodo para generar pdf de una oferta
   */
  generarPDF(){
    html2canvas(document.getElementById('oferta'), {
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
      doc.text('DETALLE DE LA OFERTA', 60, 60);
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save(`${new Date().toISOString()}_oferta.pdf`);
    });
  }

  /**
   * metodo para mostrar en un modal el pdf de la oferta
   */
  openModal(){
    $('modal').show;
    $('#modalpdf').attr('src', this.url);
  }

}
