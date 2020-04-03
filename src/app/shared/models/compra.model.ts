export class Compra{
    codigo: string;
    idFamilia: string;
    idProveedor: TProveedor;
    Nombre: string;
    precio: Number;
    stock: Number;
    min: Number;
    max: Number;

    constructor(art?){
        this.codigo = (art !== undefined) ? art.codigo : '';
        this.idFamilia = (art !== undefined) ?  art.idFamilia : '';
        this.idProveedor = new TProveedor();
        this.idProveedor.idProv1 = (art !== undefined) ? art.idProv1 : '';
        this.idProveedor.idProv2 = ( art !== undefined) ? art.idProv2 : '';
        this.Nombre = (art !== undefined) ? art.Nombre : '';
        this.precio = (art !== undefined) ? art.precio : '';
        this.stock = (art !== undefined) ? art.stock : '';
        this.min = (art !== undefined) ? art.min : '';
        this.max = (art !== undefined) ? art.max : '';
    }
}

class TProveedor{
    idProv1: string;
    idProv2: string;
}