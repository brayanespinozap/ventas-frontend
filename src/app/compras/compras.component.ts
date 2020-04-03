import { CompraService } from './../shared/servis/compra.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Compra } from '../shared/models/compra.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
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

  compras;
  compra = new Compra();

  //formulario
  frmCompra: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaCompra') ventanaCompra: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
   
  constructor(
    private compraService: CompraService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarCompra();
  }

  inicializarCompra(){
    this.frmCompra  =  this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(7)]],
      idFamilia: ['', [Validators.required, Validators.minLength(7)]],
      idProv1: ['', [Validators.required, Validators.minLength(7)]],
      idProv2: ['', [Validators.required, Validators.minLength(7)]],
      Nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ ]*')]],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      min: ['', Validators.required],
      max: ['', Validators.required],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerCompras(campo?: string){
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
    this.compraService.todosCompras(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.compras = res
       );
  }

  guardarCompra(){
    //console.log(this.frmEmpleado.value);
    if(this.frmCompra.invalid) return;
    const art = new Compra(this.frmCompra.value);

    //console.log(emp);

    switch(this.frmCompra.controls.funcion.value){
      case 'N':
              this.compraService.nuevoCompra(art)
                .subscribe(
                  res => this.compras.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.compraService.modificarCompra(art, this.frmCompra.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoCompra(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Compra';
    this.frmCompra.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaCompra.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaCompra.nativeElement, 'display', 'block');
  }

  editarCompra(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Compra';
    this.compraService.buscarCompra(id)
      .subscribe(
        res => {
          this.frmCompra.setValue({
            codigo : res[0].codigo,
            idFamilia : res[0].idFamilia,
            idProv1 : res[0].idProveedor.idProv1,
            idProv2 : res[0].idProveedor.idProv2,
            Nombre : res[0].Nombre,
            precio : res[0].precio,
            stock : res[0].stock,
            min : res[0].min,
            max : res[0].max,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaCompra.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaCompra.nativeElement, 'display', 'block');
  }

  confirmarEliminarCompra(art){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.compra.codigo = art._id;
    this.compra.Nombre = art.Nombre;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarCompra(){
     let art;
     this.compraService.eliminarCompra(this.compra.codigo)
        .subscribe(
          res => art = res,
          err => console.log(err),
          () => this.compras = this.compras.filter(e => e._id !== art._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaCompra.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaCompra.nativeElement, 'display');
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

    this.obtenerCompras();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.compraService.cantidadCompras()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerCompras('Nombre');
  }
}
