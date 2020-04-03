import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
   //uri contiene hasta el nombre del archivo que quiero consumir
   servidor = new Servidor();

   //URI_BASE = this.servidor.URL + '/empleado';
   URI_BASE = `${this.servidor.URL}/articulo`;

  constructor(private http: HttpClient) { }

  cantidadArticulos(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosArticulos(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarArticulo(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarArticulo(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoArticulo(art){
    return this.http.post(this.URI_BASE, art);
  }

  modificarArticulo(art, id){
    return this.http.put(this.URI_BASE + '/' + id, art);
  }
}
