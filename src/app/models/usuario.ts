export class Usuario{
    constructor(
        public id:number,
        public nif:string,
        public nombre:string,
        public apellido1:string,
        public apellido2:string,
        public usuario:string,
        public telefono:number,
        public email:string,
        public password: string,
        public web:string,
        public gitHub:string,
        public blog:string,
        public activo:number,
        public promocion: number,
        public perfil:string,
        public pdf: string,
        public foto: string
      ){ }
}