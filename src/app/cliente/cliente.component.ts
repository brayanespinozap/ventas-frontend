import { ClienteService } from './../shared/servis/cliente.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
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

  clientes;
  cliente = new Cliente();

  //formulario
  frmCliente: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaCliente') ventanaCliente: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
  constructor(
    private clienteService: ClienteService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarCliente();
  }

  inicializarCliente(){
    this.frmCliente  =  this.fb.group({
      id: ['', [Validators.required, Validators.minLength(7)]],
      idUsuario: [''],
      Nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ ]*')]],
      Apellido1: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ]*')]],
      Apellido2: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ]*')]],
      tel1: ['', Validators.pattern('[0-9]{7,}')],
      tel2: ['', Validators.pattern(/\([0-9]{3}\)[0-9]{4}-[0-9]{4}/)],
      Correo: ['', [Validators.required, Validators.email]],
      Direccion: ['', Validators.required],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerClientes(campo?: string){
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
    this.clienteService.todosClientes(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.clientes = res
         
       );
  }

  guardarCliente(){
    //console.log(this.frmEmpleado.value);
    if(this.frmCliente.invalid) return;
    const cliente = new Cliente(this.frmCliente.value);

    //console.log(emp);

    switch(this.frmCliente.controls.funcion.value){
      case 'N':
              this.clienteService.nuevoCliente(cliente)
                .subscribe(
                  res => this.clientes.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.clienteService.modificarCliente(cliente, this.frmCliente.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoCliente(){
    this.tituloForm = 'Nuevo Cliente';
    this.frmCliente.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaCliente.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaCliente.nativeElement, 'display', 'block');
  }

  editarCliente(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Empleado';
    this.clienteService.buscarCliente(id)
      .subscribe(
        res => {
          this.frmCliente.setValue({
            id : res[0].id,
            idUsuario : res[0].idUsuario,
            Nombre : res[0].Nombre,
            Apellido1 : res[0].Apellido1,
            Apellido2 : res[0].Apellido2,
            tel1 : res[0].Telefono.tel1,
            tel2 : res[0].Telefono.tel2,
            Correo : res[0].Correo,
            Direccion : res[0].Direccion,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaCliente.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaCliente.nativeElement, 'display', 'block');
  }

  confirmarEliminarCliente(emp){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.cliente.id = emp._id;
    this.cliente.Nombre = emp.Nombre;
    this.cliente.Apellido1 = emp.Apellido1;
    this.cliente.Apellido2 = emp.Apellido2;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarCliente(){
     let cliente;
     this.clienteService.eliminarCliente(this.cliente.id)
        .subscribe(
          res => cliente = res,
          err => console.log(err),
          () => this.clientes = this.clientes.filter(e => e._id !== cliente._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaCliente.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaCliente.nativeElement, 'display');
            break;
      case 2:
            this.renderizar.removeClass(this.ventanaConfirmar.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaConfirmar.nativeElement, 'display');
            break;
    }    
  }

  generarUsuario(){
    if(this.frmCliente.controls.Nombre.valid && this.frmCliente.controls.Apellido1.valid &&
       this.frmCliente.controls.Apellido2.valid){
      
      this.frmCliente.controls.idUsuario.setValue(
        (this.frmCliente.controls.Nombre.value).charAt(0).concat(
          this.frmCliente.controls.Apellido1.value).concat(
            this.frmCliente.controls.Apellido2.value
          ).toLowerCase()
        );
    }
  }

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

    this.obtenerClientes();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.clienteService.cantidadClientes()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerClientes('Nombre');
  }

}
