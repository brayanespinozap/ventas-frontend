export class Proveedor{
    id: string;
    Nombre: string;
    Contacto: string;
    Telefono: TTelefono;
    Correo: string;
    Direccion: string;

    constructor(proveedor?){

        this.id = (proveedor !== undefined) ? proveedor.id : '';
        this.Nombre = (proveedor !== undefined) ? proveedor.Nombre : '';
        this.Contacto = (proveedor !== undefined) ? proveedor.Contacto : '';
        this.Telefono = new TTelefono();
        this.Telefono.tel1 = (proveedor !== undefined) ? proveedor.tel1 : '';
        this.Telefono.tel2 = ( proveedor !== undefined) ? proveedor.tel2 : '';
        this.Correo = (proveedor !== undefined) ? proveedor.Correo : '';
        this.Direccion = (proveedor !== undefined) ? proveedor.Direccion : '';
    }
}

class TTelefono{
    tel1: string;
    tel2: string;
}