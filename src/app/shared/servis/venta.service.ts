import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/venta`;
  constructor(private http: HttpClient) { }

  cantidadVentas(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosVentas(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarVenta(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarVenta(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoVenta(emp){
    return this.http.post(this.URI_BASE, emp);
  }

  modificarVenta(emp, id){
    return this.http.put(this.URI_BASE + '/' + id, emp);
  }
}
