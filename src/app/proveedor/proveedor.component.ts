import { ProveedorService } from './../shared/servis/proveedor.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Proveedor } from '../shared/models/proveedor.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  //----------------------
  orden = {
    campo: 'Nombre',
    modo: -1
  };
  //--------------------------
  
  pagina = 1;
  limite = 2;
  pags = [];
  numPags;

  //------------------------------------

  proveedores;
  proveedor = new Proveedor();

  //formulario
  frmProveedor: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaProveedor') ventanaProveedor: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef; 

  constructor(
    private proveedorService: ProveedorService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarProveedor();
  }

  inicializarProveedor(){
    this.frmProveedor  =  this.fb.group({
      id: ['', [Validators.required, Validators.minLength(7)]],
      Nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ ]*')]],
      Contacto: ['', Validators.required],
      tel1: ['', Validators.pattern('[0-9]{7,}')],
      tel2: ['', Validators.pattern(/\([0-9]{3}\)[0-9]{4}-[0-9]{4}/)],
      Correo: ['', [Validators.required, Validators.email]],
      Direccion: ['', Validators.required],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerProveedores(campo?: string){
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
    this.proveedorService.todosProveedores(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.proveedores = res
       );
  }

  guardarProveedor(){
    //console.log(this.frmEmpleado.value);
    if(this.frmProveedor.invalid) return;
    const proveedor = new Proveedor(this.frmProveedor.value);

    //console.log(emp);

    switch(this.frmProveedor.controls.funcion.value){
      case 'N':
              this.proveedorService.nuevoProveedor(proveedor)
                .subscribe(
                  res => this.proveedores.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.proveedorService.modificarProveedor(proveedor, this.frmProveedor.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoProveedor(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Proveedor';
    this.frmProveedor.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaProveedor.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaProveedor.nativeElement, 'display', 'block');
  }

  editarProveedor(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Proveedor';
    this.proveedorService.buscarProveedor(id)
      .subscribe(
        res => {
          this.frmProveedor.setValue({
            id : res[0].id,
            Nombre : res[0].Nombre,
            Contacto : res[0].Contacto,
            tel1 : res[0].Telefono.tel1,
            tel2 : res[0].Telefono.tel2,
            Correo : res[0].Correo,
            Direccion : res[0].Direccion,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaProveedor.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaProveedor.nativeElement, 'display', 'block');
  }

  confirmarEliminarProveedor(proveedor){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.proveedor.id = proveedor._id;
    this.proveedor.Nombre = proveedor.Nombre;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarProveedor(){
     let proveedor;
     this.proveedorService.eliminarProveedor(this.proveedor.id)
        .subscribe(
          res => proveedor = res,
          err => console.log(err),
          () => this.proveedores = this.proveedores.filter(e => e._id !== proveedor._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaProveedor.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaProveedor.nativeElement, 'display');
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

    this.obtenerProveedores();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.proveedorService.cantidadProveedores()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerProveedores('Nombre');
  }

}
