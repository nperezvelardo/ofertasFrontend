export class Mensaje{
    constructor(
        public id:number,
        public titulo:string,
        public contenido:string,
        public usuario:number,
        public fecha:Date,
        public destino:number,
        public leido:number,
    ){}
}