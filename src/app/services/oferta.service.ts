import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OfertaService{
    constructor(
        private http: HttpClient
    ){
        
    }
  
    /**
     * metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @returns resultado de la peticion
     */
    getOfertas(): Observable<any>{
      return this.http.get('http://ofertasapp.es/ofertas');
    }
  
    /**
     * metodo para eliminar de la base de datos una oferta
     * @param id 
     * @returns resultado de la peticion
     */
    deleteOferta(id): Observable<any>{
      return this.http.delete('http://ofertasapp.es/ofertas/'+id, );
    }
  
    /**
     * metodo para sacar un unico proyecto
     * @param id 
     * @returns resultado de la peticion
     */
    getOferta(id): Observable<any>{
          return this.http.get('http://ofertasapp.es/ofertas/'+id);
    }
  
    /**
     * metodo para crear una oferta y registrarla en la base de datos
     * @param form 
     * @returns resultado de la peticion
     */
    createOferta(form: any): Observable<any>{
      return this.http.post('http://ofertasapp.es/createOferta', form.value);
    }
  
    /**
     * metodo para ordenar las ofertas
     * @param ordenacion 
     * @returns resultado de la peticion
     */
    getEordenado(ordenacion): Observable<any>{
      return this.http.get('http://ofertasapp.es/ofertasO/'+ordenacion);
    }
  
    /**
     * metodo para actualizar en la base de datos la oferta
     * @param form 
     * @param id 
     * @returns resultado de la peticion
     */
    updateOferta(form: any, id): Observable<any>{
      return this.http.put('http://ofertasapp.es/ofertas/'+id, form.value);
    }

    /**
     * metodo para obtener los ciclos de la oferta pasada por paramtero
     * @param id 
     * @returns resultado de la peticion
     */
    getCiclos(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/ofeCiclo/'+id);
    }
  
    /**
     * metodo para obtener el nombre del ciclo
     * @param id 
     * @returns resultado de la peticion
     */
    getNombreCiclo(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/ciclo/'+id);
    }

    /**
     * metodo para obtener las ofertas según el codigo del ciclo
     * @param id 
     * @returns resultado de la peticion
     */
    getCodigo(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/cicloOfe/'+id);
    }

    /**
     * metodo para guardar en la base de datos el fichero pdf de la oferta
     * @param archivo 
     * @returns resultado de la peticion
     */
    uploadFile(archivo) {
      return this.http.post('http://ofertasapp.es/createArchivo', JSON.stringify(archivo));
    }

    /**
     * metodo para guardar en la base de datos el fichero pdf de la oferta
     * @param archivo 
     * @param id
     * @returns resultado de la peticion
     */
     updateFile(archivo, id) {
      return this.http.post('http://ofertasapp.es/updateArchivo/'+id, JSON.stringify(archivo));
    }
  
    /**
     * metodo para enviar un email 
     * @param form 
     * @returns resultado de la peticion
     */
    enviarEmailUsuarios(form: any): Observable<any>{
      return this.http.post('http://ofertasapp.es/enviarEmailUsuarios', form.value);
    }

}

