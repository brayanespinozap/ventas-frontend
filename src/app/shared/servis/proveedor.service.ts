import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/proveedor`; 

  constructor(private http: HttpClient) { }

  cantidadProveedores(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosProveedores(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarProveedor(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarProveedor(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoProveedor(emp){
    return this.http.post(this.URI_BASE, emp);
  }

  modificarProveedor(emp, id){
    return this.http.put(this.URI_BASE + '/' + id, emp);
  }
}
