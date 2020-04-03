import { VentaService } from './../shared/servis/venta.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Venta } from '../shared/models/venta.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
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

  ventas;
  venta = new Venta();

  //formulario
  frmVenta: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaVenta') ventanaVenta: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
   
  constructor(
    private ventaService: VentaService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarVenta();
  }

  inicializarVenta(){
    this.frmVenta  =  this.fb.group({
      idVenta: ['', [Validators.required, Validators.minLength(7)]],
      idCliente: ['', [Validators.required, Validators.minLength(7)]],
      idEmpleado: ['', [Validators.required, Validators.minLength(7)]],
      codigo: ['', [Validators.required, Validators.minLength(7)]],
      cant: ['', [Validators.required]],
      fecha: ['', Validators.required],
      IV: ['', Validators.required],
      descuento: ['', Validators.required],
      tipoPago: ['', Validators.required],
      aprobaTarj: ['', Validators.required],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerVentas(campo?: string){
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
    this.ventaService.todosVentas(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.ventas = res
       );
  }

  guardarVenta(){
    //console.log(this.frmEmpleado.value);
    if(this.frmVenta.invalid) return;
    const venta = new Venta(this.frmVenta.value);

    //console.log(emp);

    switch(this.frmVenta.controls.funcion.value){
      case 'N':
              this.ventaService.nuevoVenta(venta)
                .subscribe(
                  res => this.ventas.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.ventaService.modificarVenta(venta, this.frmVenta.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoVenta(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Articulo';
    this.frmVenta.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaVenta.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaVenta.nativeElement, 'display', 'block');
  }

  editarVenta(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Venta';
    this.ventaService.buscarVenta(id)
      .subscribe(
        res => {
          this.frmVenta.setValue({
            idVenta: res[0].idVenta,
            idCliente: res[0].idCliente,
            idEmpleado: res[0].idEmpleado,
            codigo: res[0].codigo,
            cant: res[0].cant,
            fecha: res[0].fecha,
            IV: res[0].IV,
            descuento: res[0].descuento,
            tipoPago: res[0].tipoPago,
            aprobaTarj: res[0].aprobaTarj,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaVenta.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaVenta.nativeElement, 'display', 'block');
  }

  confirmarEliminarVenta(venta){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.venta.idVenta = venta.idVenta;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarVenta(){
     let venta;
     this.ventaService.eliminarVenta(this.venta.codigo)
        .subscribe(
          res => venta = res,
          err => console.log(err),
          () => this.ventas = this.ventas.filter(e => e._id !== venta._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaVenta.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaVenta.nativeElement, 'display');
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

    this.obtenerVentas();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.ventaService.cantidadVentas()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerVentas('Descuento');
  }

}
