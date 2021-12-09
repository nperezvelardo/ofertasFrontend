import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CicloService{
    constructor(
        private http: HttpClient
    ){
        
    }
  
    /**
     * metodo para sacar de la base de datos y consumir de nuestra api todos nuestros ciclos
     * @param id 
     * @returns listado de ciclos
     */
    getCiclos(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/cicloFam/'+id); //https://40136589.servicio-online.net/
    }

}

