export class User {
    idUsuario: string;
    usuario: string;
    passw: string;
    rol: number;
    token?: string;

    constructor(user?){
        this.idUsuario = (user !== undefined) ? user.idUsuario : '';
        this.usuario = (user !== undefined) ?  user.usuario : '';
        this.passw = (user !== undefined) ? user.passw : '';
        this.rol = (user !== undefined) ? user.rol : '';
        this.token = (user !== undefined) ? user.token : '';
    }
}