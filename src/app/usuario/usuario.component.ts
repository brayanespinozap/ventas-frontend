import { UsuarioService } from './../shared/servis/usuario.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { User } from '../shared/models/user.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  //----------------------
  orden = {
    campo: 'Nombre',
    modo: -1
  };
  //--------------------------
  
  pagina = 1;
  limite = 10;
  pags = [];
  numPags;

  //------------------------------------

  usuarios;
  usuario = new User();

  //formulario
  frmUsuario: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaUsuario') ventanaUsuario: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
  constructor(
    private usuarioService: UsuarioService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarUsuario();
  }

  inicializarUsuario(){
    this.frmUsuario  =  this.fb.group({
      idUsuario: ['', [Validators.required, Validators.minLength(6)]],
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      passw: ['', [Validators.required, Validators.minLength(7)]],
      rol: ['', Validators.required],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerUsuarios(campo?: string){
    if(campo !== undefined){
      if(this.orden.campo.localeCompare(campo) !== 0){
        this.orden.modo = -1;
      }

      this.orden.campo = campo;
      if(this.orden.modo === 1){
        this.orden.modo = -1;
      }else{
        this.orden.modo = 1;
      }
    }
    this.usuarioService.todosUsuarios(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.usuarios = res
       );
  }

  guardarUsuario(){
    //console.log(this.frmEmpleado.value);
    if(this.frmUsuario.invalid) return;
    const user = new User(this.frmUsuario.value);

    //console.log(emp);

    switch(this.frmUsuario.controls.funcion.value){
      case 'N':
              this.usuarioService.nuevoUsuario(user)
                .subscribe(
                  res => this.usuarios.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.usuarioService.modificarUsuario(user, this.frmUsuario.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoUsuario(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Usuario';
    this.frmUsuario.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaUsuario.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaUsuario.nativeElement, 'display', 'block');
  }

  editarUsuario(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Usuario';
    this.usuarioService.buscarUsuario(id)
      .subscribe(
        res => {
          this.frmUsuario.setValue({
            idUsuario : res[0].idUsuario,
            usuario : res[0].usuario,
            passw : res[0].passw,
            rol : res[0].rol,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaUsuario.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaUsuario.nativeElement, 'display', 'block');
  }

  confirmarEliminarUsuario(user){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.usuario.idUsuario = user._id;
    this.usuario.usuario = user.usuario;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarUsuario(){
     let user;
     this.usuarioService.eliminarUsuario(this.usuario.idUsuario)
        .subscribe(
          res => user = res,
          err => console.log(err),
          () => this.usuarios = this.usuarios.filter(e => e._id !== user._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaUsuario.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaUsuario.nativeElement, 'display');
            break;
      case 2:
            this.renderizar.removeClass(this.ventanaConfirmar.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaConfirmar.nativeElement, 'display');
            break;
    }    
  }

  /*generarUsuario(){
    if(this.frmEmpleado.controls.Nombre.valid && this.frmEmpleado.controls.Apellido1.valid &&
       this.frmEmpleado.controls.Apellido2.valid){
      
      this.frmEmpleado.controls.idUsuario.setValue(
        (this.frmEmpleado.controls.Nombre.value).charAt(0).concat(
          this.frmEmpleado.controls.Apellido1.value).concat(
            this.frmEmpleado.controls.Apellido2.value
          ).toLowerCase()
        );
    }
  }*/

  cambiarPagina(pag){
    if(pag === -1){
      if(this.pagina > 1){
        this.pagina--;
      }else{
        this.pagina = this.numPags;
      }
    }else if(pag === 0){
      if(this.pagina < this.numPags){
        this.pagina++;
      }else{
        this.pagina = 1;
      }
    }else{
      this.pagina = pag;
    }

    this.obtenerUsuarios();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.usuarioService.cantidadUsuarios()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerUsuarios('rol');
  }

}
