import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutenticacionService } from './../shared/services/autenticacion.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
//activar la ruta que queramos activar, contiene la ruta activa y luego la guardamos en la ruta de retorno
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  //elementos para el formulario
  loginForm : FormGroup;

  returnUrl: string;//esto es para guardar la ruta que envio a login
  error;


  constructor(
    private fb: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router, 
    private route: ActivatedRoute
  ) { }

  onSubmit() {
    //console.log(this.loginForm.controls);
    if(this.loginForm.invalid){
      return;
    }
    this.autenticacionService.login(
      this.loginForm.controls.usuario.value, this.loginForm.controls.passw.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
            //enviar a cambiar el nav bar a Logout
            this.autenticacionService.sendMensaje('Logout');
          },
          error => {
            this.error = error;
            //enviar a que cambie el nav bar a login
            this.autenticacionService.sendMensaje('Login');
          }
        )
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      passw: ['', Validators.required]
    });
    this.autenticacionService.sendMensaje('Login');
    this.autenticacionService.logout();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

}
