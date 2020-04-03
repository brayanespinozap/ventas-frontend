export class Cliente{
    id: string;
    idUsuario: string;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    Telefono: TTelefono;
    Correo: string;
    Direccion: string;

    constructor(cliente?){

        this.id = (cliente !== undefined) ? cliente.id : '';
        this.idUsuario = (cliente !== undefined) ?  cliente.idUsuario : '';
        this.Nombre = (cliente !== undefined) ? cliente.Nombre : '';
        this.Apellido1 = (cliente !== undefined) ? cliente.Apellido1 : '';
        this.Apellido2 = (cliente !== undefined) ? cliente.Apellido2 : '';
        this.Telefono = new TTelefono();
        this.Telefono.tel1 = (cliente !== undefined) ? cliente.tel1 : '';
        this.Telefono.tel2 = ( cliente !== undefined) ? cliente.tel2 : '';
        this.Correo = (cliente !== undefined) ? cliente.Correo : '';
        this.Direccion = (cliente !== undefined) ? cliente.Direccion : '';
    }
}

class TTelefono{
    tel1: string;
    tel2: string;
}