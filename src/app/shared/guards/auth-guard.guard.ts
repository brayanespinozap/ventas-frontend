import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from './../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(
    private router: Router,
    private autenticationService: AutenticacionService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUser = this.autenticationService.currentUserValue;
    
    if(currentUser){
      //retornar verdadero porque se logeo de forma correcta
      // veriicar si la ruta está resguardad por roles
      if(next.data.roles && next.data.roles.indexOf(currentUser.rol) === -1){
        this.router.navigate(['/']);
        return false;
      }
      return true; 
    }

    //no se logeo de forma correcta retorna la página de login la url
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

/*
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
*/
