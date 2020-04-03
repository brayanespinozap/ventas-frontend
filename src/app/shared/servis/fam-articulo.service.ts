import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidor } from '../servidor';

@Injectable({
  providedIn: 'root'
})
export class FamArticuloService {
  //uri contiene hasta el nombre del archivo que quiero consumir
  servidor = new Servidor();

  //URI_BASE = this.servidor.URL + '/empleado';
  URI_BASE = `${this.servidor.URL}/familia`;

  constructor(private http: HttpClient) { }
  cantidadFamilias(){
    return this.http.get(`${this.URI_BASE}/cant`);
  }

  todosFamilias(orden, pag, limit) {
    return this.http.get(`${this.URI_BASE}/orden/${orden.campo}/${orden.modo}/${pag}/${limit}`);
    //return this.http.get(this.URI_BASE + '/orden/' + orden.campo + '/' + orden.modo + '/' + pag + '/' + limit);
  }

  buscarFamilia(id){
    return this.http.get(this.URI_BASE + '/buscar/' + id);
  }

  eliminarFamilia(id){
    return this.http.delete(this.URI_BASE + '/' + id);
  }

  nuevoFamilia(fam){
    return this.http.post(this.URI_BASE, fam);
  }

  modificarFamilia(fam, id){
    return this.http.put(this.URI_BASE + '/' + id, fam);
  }
}
