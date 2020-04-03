export class Familia{
    idFamilia: string;
    Nombre: string;

    constructor(fam?){
        this.idFamilia = (fam !== undefined) ? fam.idFamilia : '';
        this.Nombre = (fam !== undefined) ?  fam.Nombre : '';
    }
}