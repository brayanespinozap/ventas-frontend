import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/compra`;

 constructor(private http: HttpClient) { }

 cantidadCompras(){
   return this.http.get(`${this.URI_BASE}/cant`);
 }

 todosCompras(orden, pag, limit) {
   return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
   //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
 }

 buscarCompra(id){
   return this.http.get(this.URI_BASE + '/buscar/' + id);
 }

 eliminarCompra(id){
   return this.http.delete(this.URI_BASE + '/' + id);
 }

 nuevoCompra(art){
   return this.http.post(this.URI_BASE, art);
 }

 modificarCompra(art, id){
   return this.http.put(this.URI_BASE + '/' + id, art);
 }
}
