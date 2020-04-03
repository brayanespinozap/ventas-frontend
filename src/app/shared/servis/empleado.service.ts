import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/empleado`;
  
  constructor(private http: HttpClient) { }

  cantidadEmpleados(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosEmpleados(orden, pag, limit) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = 'bearer ' + user.token;

    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`, { headers: {authorization: token}});
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarEmpleado(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarEmpleado(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoEmpleado(emp){
    return this.http.post(this.URI_BASE, emp);
  }

  modificarEmpleado(emp, id){
    return this.http.put(this.URI_BASE + '/' + id, emp);
  }
}
