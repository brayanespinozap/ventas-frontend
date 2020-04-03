import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../shared/servis/usuario.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-cambiopassw',
  templateUrl: './cambiopassw.component.html',
  styleUrls: ['./cambiopassw.component.css']
})
export class CambiopasswComponent implements OnInit {
  cambioForm : FormGroup;
  usuarios;

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService
  ) {
    this.inicializarCambioForm();
   }

  inicializarCambioForm(){
    this.cambioForm  =  this.fb.group({
      usuario: ['', [Validators.required]],
      newpassw: ['', [Validators.required]]
    });
  }

  obtenerUsuarios(){
    this.userService.todosUsuarios2()
       .subscribe(
         res => this.usuarios = res
       );
  }

  onSubmit(){
    if(this.cambioForm.invalid) return;
    
    let usuario = this.usuarios.filter(e => e.usuario == this.cambioForm.controls.usuario.value)[0];
    usuario.passw = this.cambioForm.controls.newpassw.value;
    const user = new User(usuario);
    //console.log(user);
    this.userService.modificarUsuario2(user, this.cambioForm.controls.usuario.value)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );

    alert('Modificado correctamente');
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

}
