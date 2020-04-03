export class Empleado{
    id: string;
    idUsuario: string;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    Telefono: TTelefono;
    Correo: string;
    Direccion: string;

    constructor(emp?){

        this.id = (emp !== undefined) ? emp.id : '';
        this.idUsuario = (emp !== undefined) ?  emp.idUsuario : '';
        this.Nombre = (emp !== undefined) ? emp.Nombre : '';
        this.Apellido1 = (emp !== undefined) ? emp.Apellido1 : '';
        this.Apellido2 = (emp !== undefined) ? emp.Apellido2 : '';
        this.Telefono = new TTelefono();
        this.Telefono.tel1 = (emp !== undefined) ? emp.tel1 : '';
        this.Telefono.tel2 = ( emp !== undefined) ? emp.tel2 : '';
        this.Correo = (emp !== undefined) ? emp.Correo : '';
        this.Direccion = (emp !== undefined) ? emp.Direccion : '';
    }
}

class TTelefono{
    tel1: string;
    tel2: string;
}