import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/usuario`;
  
  constructor(private http: HttpClient) { }
  cantidadUsuarios(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosUsuarios2() {
    return this.http.get(this.URI_BASE);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  todosUsuarios(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarUsuario(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  buscarUsuario2(usuario){
    return this.http.get(this.URI_BASE + '/' + usuario);
  }

  eliminarUsuario(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoUsuario(user){
    return this.http.post(this.URI_BASE, user);
  }

  modificarUsuario(user, id){
    return this.http.put(this.URI_BASE + '/' + id, user);
  }

  modificarUsuario2(user, usuario){
    return this.http.put(this.URI_BASE + '/NombreUsuario/' + usuario, user);
  }
}
