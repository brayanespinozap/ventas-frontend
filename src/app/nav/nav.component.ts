import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AutenticacionService } from '../shared/services/autenticacion.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  estadoLog = 'Login';
  subcription: Subscription;

  constructor(
    private route: Router,
    private autenticacionService: AutenticacionService
  ) {
    this.subcription = this.autenticacionService.getMensaje()
      .subscribe(mensaje => this.estadoLog = mensaje);
   }

  ngOnInit() {
    this.subcription = this.autenticacionService.getMensaje()
    .subscribe(
      mensaje => {
        if(mensaje){
          this.estadoLog = mensaje.text;
        }
      }
    )
  }

}
