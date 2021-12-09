import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MensajeService{
    constructor(
        private http: HttpClient
    ){
        
    }
  
    /**
     * 
     * @returns 
     */
    //metodo para sacar de la base de datos y consumir de nuestra api todos nuestras mensajes registrados para cada usuario
    getMensajes(): Observable<any>{
        return this.http.get('http://ofertasapp.es/mensajes');
    }
    
    /**
     * 
     * @param id 
     * @returns 
     */
    //método para eliminar el mensaje especificado según su id
    deleteMensaje(id): Observable<any>{
        return this.http.delete('http://ofertasapp.es/mensajes/'+id, );
    }

    /**
     * metodo para sacar un unico mensaje
     * @param id 
     * @returns resultado de la peticion
     */
    getMensaje(id): Observable<any>{    
        return this.http.get('http://ofertasapp.es/mensajes/'+id);
    }

    /**
     * metodo para obtener mensajes no leidos del usuario
     * @param id 
     * @returns resultado de la peticion
     */
    getNoLeido(id): Observable<any>{    
        return this.http.get('http://ofertasapp.es/noLeidos/'+id);
    }

    /**
     * metodo para modificar el mensaje a leido
     * @param id 
     * @returns resultado de la peticion
     */
    leido(id): Observable<any>{    
        return this.http.get('http://ofertasapp.es/leido/'+id);
    }
  
    /**
     * metodo para crear un mensaje
     */
    createMensaje(form:any): Observable<any>{
      return this.http.post('http://ofertasapp.es/createMensaje', form.value);
    }

}