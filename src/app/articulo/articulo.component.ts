import { ArticuloService } from './../shared/servis/articulo.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Articulo } from '../shared/models/articulo.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {
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

  articulos;
  articulo = new Articulo();

  //formulario
  frmArticulo: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaArticulo') ventanaArticulo: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
   
  constructor(
    private articuloService: ArticuloService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarArticulo();
  }

  inicializarArticulo(){
    this.frmArticulo  =  this.fb.group({
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

  obtenerArticulos(campo?: string){
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
    this.articuloService.todosArticulos(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.articulos = res
       );
  }

  guardarArticulo(){
    //console.log(this.frmEmpleado.value);
    if(this.frmArticulo.invalid) return;
    const art = new Articulo(this.frmArticulo.value);

    //console.log(emp);

    switch(this.frmArticulo.controls.funcion.value){
      case 'N':
              this.articuloService.nuevoArticulo(art)
                .subscribe(
                  res => this.articulos.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.articuloService.modificarArticulo(art, this.frmArticulo.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoArticulo(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nuevo Articulo';
    this.frmArticulo.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaArticulo.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaArticulo.nativeElement, 'display', 'block');
  }

  editarArticulo(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Articulo';
    this.articuloService.buscarArticulo(id)
      .subscribe(
        res => {
          this.frmArticulo.setValue({
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

    this.renderizar.addClass(this.ventanaArticulo.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaArticulo.nativeElement, 'display', 'block');
  }

  confirmarEliminarArticulo(art){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.articulo.codigo = art._id;
    this.articulo.Nombre = art.Nombre;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarArticulo(){
     let art;
     this.articuloService.eliminarArticulo(this.articulo.codigo)
        .subscribe(
          res => art = res,
          err => console.log(err),
          () => this.articulos = this.articulos.filter(e => e._id !== art._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaArticulo.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaArticulo.nativeElement, 'display');
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

    this.obtenerArticulos();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.articuloService.cantidadArticulos()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerArticulos('Nombre');
  }

}
