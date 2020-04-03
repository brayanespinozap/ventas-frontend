import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  servidor = new Servidor();

  URI_BASE = `${this.servidor.URL}/cliente`;
  constructor(private http: HttpClient) { }

  cantidadClientes(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosClientes(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarCliente(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarCliente(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoCliente(cliente){
    return this.http.post(this.URI_BASE, cliente);
  }

  modificarCliente(cliente, id){
    return this.http.put(this.URI_BASE + '/' + id, cliente);
  }
}
