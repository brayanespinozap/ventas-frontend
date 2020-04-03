import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servidor } from '../servidor';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;//esto es para poder tener acceso donde lo injecto
  private subject = new Subject<any>();
  servidor = new Servidor();

  URI_BASE = this.servidor.URL + '/usuario';


  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));//lo estamos leyendo
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(usuario: string, passw: string){
    return this.http.post<any>(this.URI_BASE + '/logg', { usuario: usuario, passw: passw })
      .pipe(
        map(
          user => {
            if(user && user.token){
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
            return user;
          }
        )
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  sendMensaje(mensaje: string) {
    return this.subject.next({text: mensaje});
  }

  getMensaje(){
    return this.subject.asObservable();
  }
}
