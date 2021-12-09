import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * obtenemos todas las operaciones registradas
   * @returns resultado de la peticion
   */
  getLogs(): Observable<any>{
    return this.http.get('http://ofertasapp.es/logs');
  }

  /**
   * eliminamos todas las operaciones de la base de datos
   * @returns resultado de la peticion
   */
  deleteLogs(): Observable<any>{
		return this.http.get('http://ofertasapp.es/logsE' );
	}

  /**
   * eliminamos solo una operacion según el su id
   * @param id 
   * @returns resultado de la peticion
   */
  deleteLog(id): Observable<any>{
		return this.http.get('http://ofertasapp.es/logsDe/'+id );
	}
  
  /**
  * Metodo para imprimir el listado completo de logs disponibles en la base de datos
  */
  imprimir(): Observable<any>{
		return this.http.get('http://ofertasapp.es/imprimir');
	}

}
