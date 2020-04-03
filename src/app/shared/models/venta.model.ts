export class Venta{ 
    idVenta: string;
    idCliente: string;
    idEmpleado: string;
    codigo: string;
    cant: Number;
    fecha: String;
    descuento: Number;
    IV: Number;
    tipoPago: String;
   aprobaTarj : String;

    constructor(venta?){
        this.idVenta = (venta !== undefined) ? venta.idVenta : '';
        this.idCliente = (venta !== undefined) ?  venta.idCliente : '';
        this.idEmpleado = (venta !== undefined) ? venta.idEmpleado : '';
        this.codigo = (venta !== undefined) ? venta.codigo : '';
        this.cant = (venta !== undefined) ? venta.cant : '';
        this.fecha = (venta !== undefined) ? venta.fecha : '';
        this.descuento = (venta !== undefined) ? venta.descuento : '';
        this.IV = (venta !== undefined) ? venta.IV : '';
        this.tipoPago = (venta !== undefined) ? venta.tipoPago : '';
        this.aprobaTarj = (venta !== undefined) ? venta.aprobaTarj : '';

    }
}

  