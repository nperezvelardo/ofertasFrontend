import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FamiliaService{
    constructor(
        private http: HttpClient
    ){
        
    }
  
    /**
     * metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @returns listado familias profesionales
     */
    getFamilia(): Observable<any>{
      return this.http.get('http://ofertasapp.es/fam');
    }
  
    

}