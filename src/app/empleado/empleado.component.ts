import { EmpleadoService } from './../shared/servis/empleado.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Empleado } from '../shared/models/empleado.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import * as jsPDF from 'jspdf';
//import 'jspdf-autotable'
declare let jsPDF: any;

@Component({
  selector: 'app-empleado',//para mostrar mi html
  templateUrl: './empleado.component.html',//esta es la plantilla
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
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

  empleados;
  empleado = new Empleado();

  //formulario
  frmEmpleado: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaEmpleado') ventanaEmpleado: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;

  constructor(
    private empleadoService: EmpleadoService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarEmpleado();
  }

  inicializarEmpleado(){
    this.frmEmpleado  =  this.fb.group({
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

  obtenerEmpleados(campo?: string){
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
    this.empleadoService.todosEmpleados(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.empleados = res
       );
  }

  guardarEmpleado(){
    //console.log(this.frmEmpleado.value);
    if(this.frmEmpleado.invalid) return;
    const emp = new Empleado(this.frmEmpleado.value);

    //console.log(emp);

    switch(this.frmEmpleado.controls.funcion.value){
      case 'N':
              this.empleadoService.nuevoEmpleado(emp)
                .subscribe(
                  res => this.empleados.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.empleadoService.modificarEmpleado(emp, this.frmEmpleado.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoEmpleado(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Empleado';
    this.frmEmpleado.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaEmpleado.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaEmpleado.nativeElement, 'display', 'block');
  }

  editarEmpleado(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Empleado';
    this.empleadoService.buscarEmpleado(id)
      .subscribe(
        res => {
          this.frmEmpleado.setValue({
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

    this.renderizar.addClass(this.ventanaEmpleado.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaEmpleado.nativeElement, 'display', 'block');
  }

  confirmarEliminarEmpleado(emp){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.empleado.id = emp._id;
    this.empleado.Nombre = emp.Nombre;
    this.empleado.Apellido1 = emp.Apellido1;
    this.empleado.Apellido2 = emp.Apellido2;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarEmpleado(){
     let empl;
     this.empleadoService.eliminarEmpleado(this.empleado.id)
        .subscribe(
          res => empl = res,
          err => console.log(err),
          () => this.empleados = this.empleados.filter(e => e._id !== empl._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaEmpleado.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaEmpleado.nativeElement, 'display');
            break;
      case 2:
            this.renderizar.removeClass(this.ventanaConfirmar.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaConfirmar.nativeElement, 'display');
            break;
    }    
  }

  generarUsuario(){
    if(this.frmEmpleado.controls.Nombre.valid && this.frmEmpleado.controls.Apellido1.valid &&
       this.frmEmpleado.controls.Apellido2.valid){
      
      this.frmEmpleado.controls.idUsuario.setValue(
        (this.frmEmpleado.controls.Nombre.value).charAt(0).concat(
          this.frmEmpleado.controls.Apellido1.value).concat(
            this.frmEmpleado.controls.Apellido2.value
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

    this.obtenerEmpleados();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }


  //--------------------------IMPRIMIR----------------------------------
  textoCentro(doc, texto, y){
    //const doc = new jsPDF('letter', 'mm');
    const ancho = doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const desplazado = (doc.internal.pageSize.width - ancho) / 2;

    doc.text(texto, desplazado, y);
  }
  
  onImprimir(){
    const doc = new jsPDF('p', 'mm', 'letter');
    //doc.text('texto de prueba', 60 , 20);

    this.textoCentro(doc, 'CATALOGO DE EMPLEADOS', 20);
    doc.line(20, 25, 194, 25);

    doc.autoTable({html: '#tablaDatos', startY: 30});
    doc.autoPrint();
    //doc.save(Date.now() + 'rpt.pdf');
  }

  //--------------------------------------------------------------------

  ngOnInit() {
    this.empleadoService.cantidadEmpleados()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerEmpleados('Nombre');
  }

}
