export class Oferta{
    constructor(
        public id: number,
        public empresa: string,
        public fecha: Date,
        public informacion: string,
        public pdf: string
    ){}
}