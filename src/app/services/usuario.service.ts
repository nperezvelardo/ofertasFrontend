import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  /**
   * metodo para registrar un usuario
   * @param form 
   * @returns resultado de la peticion
   */
    registerUser(form: any): Observable<any>{
      return this.http.post('http://ofertasapp.es/usuarios', form.value);
    }
  
    /**
     * metodo para hacer login en la app
     * @param form 
     * @returns resultado de la peticion
     */
    logIn(form: any): Observable<any>{
      return this.http.post('http://ofertasapp.es/login', form.value);
    }
  
    /**
     * metodo que se loguea mediante google
     * @param email 
     * @returns resultado de la peticion
     */
    logInGoogle(email): Observable<any>{
      return this.http.get('http://ofertasapp.es/loginGoogle/'+email);
    }
  
    /**
     * metodo para establecer una nueva contraseña cuando se le olvide al usuario
     * @param form 
     * @returns resultado de la peticion
     */
    restablecer(form:any): Observable<any>{
      return this.http.post('http://ofertasapp.es/resCon', form.value);
    }
  
    /**
     * metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @returns resultado de la peticion
     */
    getUsers(): Observable<any>{
      return this.http.get('http://ofertasapp.es/usuarios');
    }
  
    /**
     * metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @returns resultado de la peticion
     */
    getUsersActivos(): Observable<any>{
      return this.http.get('http://ofertasapp.es/userActivos');
    }

    /**
     * //metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @param id 
     * @returns resultado de la peticion
     */
    getUsersActivosSin(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/userActivosSin/'+id);
    }

    /**
     * //metodo para sacar de la base de datos y consumir de nuestra api todos nuestras entradas
     * @returns resultado de la peticion
     */
    getUserNoActivos(): Observable<any>{
      return this.http.get('http://ofertasapp.es/userNoActivos');
    }
  
    /**
     * metodo para activar usuarios
     * @param id 
     * @returns resultado de la peticion
     */
    activarUsers(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/activar/'+id);
    }
  
    /**
     * metodo para eliminar un usuario
     * @param id 
     * @returns resultado de la peticion
     */
    deleteUsers(id): Observable<any>{
      return this.http.delete('http://ofertasapp.es/usuarios/'+id );
    }
  
    /**
     * metodo que obtiene un usuario
     * @param id 
     * @returns resultado de la peticion
     */
    getUser(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/usuarios/'+id);
    }
  
    /**
     * metodo que obtiene los ciclos mediante el codigo del ciclo
     * @param id 
     * @returns resultado de la peticion
     */
    getCiclos(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/usuCiclo/'+id);
    }
  
    /**
     * metodo que obtiene los ciclos del usuario pasado por parametro
     * @param id 
     * @returns resultado de la peticion
     */
    getCiclosUsu(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/cicloUsu/'+id);
    }
  
    /**
     * metodo que obtiene el nombre del ciclo 
     * @param id 
     * @returns resultado de la peticion
     */
    getNombreCiclo(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/ciclo/'+id);
    }
  
    /**
     * metodo que actualiza un usuario
     * @param form 
     * @param id 
     * @returns resultado de la peticion
     */
    actuser(form:any, id): Observable<any>{
      return this.http.put('http://ofertasapp.es/usuarios/'+id, form.value);
    }
  
    /**
     * metodo que envia el fichero pdf del curriculum y lo guarda
     * @param archivo 
     * @returns resultado de la peticion
     */
    uploadFile(archivo) {
      return this.http.post('http://ofertasapp.es/createCurriculum', JSON.stringify(archivo));
    }

    /**
     * metodo que envia la imagen del usuario y lo guarda
     * @param archivo 
     * @returns resultado de la peticion
     */
    uploadImagen(archivo) {
      return this.http.post('http://ofertasapp.es/createImagen', JSON.stringify(archivo));
    }
  
    /**
     * metodo que envia un correo cuando el usuario ha sido activado
     * @param correo 
     * @returns resultado de la peticion
     */
    enviarEmail(correo): Observable<any>{
      return this.http.get('http://ofertasapp.es/enviarEmail/'+correo);
    }
  
    /**
     * metodo para importar usuarios desde excel
     * @param archivo 
     * @returns resultado de la peticion
     */
    importFile(archivo){
      return this.http.post('http://ofertasapp.es/importExcel', archivo);
    }
  
    /**
     * metodo para desactivar usuarios
     * @param id 
     * @returns resultado de la peticion
     */
    desactivarUsers(id): Observable<any>{
      return this.http.get('http://ofertasapp.es/desactivar/'+id);
    }

    /**
     * metodo que envia el fichero pdf del curriculum y lo actualiza
     * @param archivo 
     * @param id
     * @returns resultado de la peticion
     */
     updateFile(archivo, id) {
      return this.http.post('http://ofertasapp.es/updateCurriculum/'+id, JSON.stringify(archivo));
    }

    /**
     * metodo que envia la imagen del usuario y lo actualiza
     * @param archivo 
     * @param id
     * @returns resultado de la peticion
     */
    updateImagen(archivo, id) {
      return this.http.post('http://ofertasapp.es/updateImagen/'+id, JSON.stringify(archivo));
    }
  
    /**
     * metodo que envia un correo cuando el usuario se ha registrado
     * @returns resultado de la peticion
     */
    enviarEmailRegistro(): Observable<any>{
      return this.http.get('http://ofertasapp.es/enviarEmailRegistro');
    }
  
    /**
     * metodo que registra la operacion de logOut
     * @param usuario 
     * @returns resultado de la peticion
     */
    logOut(usuario): Observable<any>{
      return this.http.get('http://ofertasapp.es/logOut/'+usuario);
    }
}
