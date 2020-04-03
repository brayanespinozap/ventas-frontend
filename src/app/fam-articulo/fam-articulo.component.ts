import { FamArticuloService } from './../shared/servis/fam-articulo.service';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Familia } from '../shared/models/familia.model';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-fam-articulo',
  templateUrl: './fam-articulo.component.html',
  styleUrls: ['./fam-articulo.component.css']
})
export class FamArticuloComponent implements OnInit {
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

  familias;
  familia = new Familia();

  //formulario
  frmFamilia: FormGroup;
  tituloForm: string;
  errorDup = '';

  //---------------------

  //viewChlid me permite referirme a cualquier elemento del DOM siempre y cuando haya un nombre
  // luego lo guardo en una variable de tipo ElementRef
  @ViewChild('ventanaFamilia') ventanaFamilia: ElementRef;
  @ViewChild('ventanaConfirmar') ventanaConfirmar: ElementRef;
  @ViewChild('color') color: ElementRef;
  constructor(
    private familiaService: FamArticuloService,
    private renderizar: Renderer2,
    private fb: FormBuilder
  ) { 
    this.inicializarFamilia();
  }

  inicializarFamilia(){
    this.frmFamilia  =  this.fb.group({
      idFamilia: ['', [Validators.required, Validators.minLength(7)]],
      Nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[A-Za-zÑñáéíóúÁÉÍÓÚ ]*')]],
      funcion: ['N'],
      _id: ['']
    });
  }

  obtenerFamilias(campo?: string){
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
    this.familiaService.todosFamilias(this.orden, this.pagina, this.limite)
       .subscribe(
         res => this.familias = res
       );
  }

  guardarFamilia(){
    //console.log(this.frmEmpleado.value);
    if(this.frmFamilia.invalid) return;
    const fam = new Familia(this.frmFamilia.value);

    //console.log(emp);

    switch(this.frmFamilia.controls.funcion.value){
      case 'N':
              this.familiaService.nuevoFamilia(fam)
                .subscribe(
                  res => this.familias.push(res),
                  err => {
                    const msg = (err.error.errmsg.indexOf('id_') > -1) ? 'Id duplicado' : 'idUsuario duplicado';
                    this.errorDup = (err.error.code === 11000) ? msg : '';
                    console.log(err);
                  }
                )
              break;
      case 'E':
              this.familiaService.modificarFamilia(fam, this.frmFamilia.controls._id.value)
                .subscribe(
                  res => console.log(res),
                  err => console.log(err)
                );
              break;
    }
  }

  nuevoFamilia(){
    //alert('Hola');
    //console.log('Funciona');
    this.tituloForm = 'Nueva Familia';
    this.frmFamilia.reset({funcion: 'N', _id: ''});

    this.renderizar.addClass(this.ventanaFamilia.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaFamilia.nativeElement, 'display', 'block');
  }

  editarFamilia(id){
    //console.log('Editar empleado ' + id);
    this.tituloForm = 'Modificar Familia';
    this.familiaService.buscarFamilia(id)
      .subscribe(
        res => {
          this.frmFamilia.setValue({
            idFamilia : res[0].idFamilia,
            Nombre : res[0].Nombre,
            funcion : 'E',
            _id: res[0]._id
          })
        }
      )

    this.renderizar.addClass(this.ventanaFamilia.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaFamilia.nativeElement, 'display', 'block');
  }

  confirmarEliminarFamilia(fam){
    this.renderizar.addClass(this.ventanaConfirmar.nativeElement, 'show');
    this.renderizar.setStyle(this.ventanaConfirmar.nativeElement, 'display', 'block');
    this.familia.idFamilia = fam._id;
    this.familia.Nombre = fam.Nombre;
    //this.nomEmpleado = `${emp.Nombre} ${emp.Apellido1} ${emp.Apellido2}`;
  }

  eliminarFamilia(){
     let fam;
     this.familiaService.eliminarFamilia(this.familia.idFamilia)
        .subscribe(
          res => fam = res,
          err => console.log(err),
          () => this.familias = this.familias.filter(e => e._id !== fam._id)
        );

     this.cerrarVentana(2);
  }

  //funciones generales
  cerrarVentana(v: number){
    switch (v){
      case 1:
            this.renderizar.removeClass(this.ventanaFamilia.nativeElement, 'show');
            this.renderizar.removeStyle(this.ventanaFamilia.nativeElement, 'display');
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

    this.obtenerFamilias();
    //this.renderizar.setStyle(this.color.nativeElement, 'background', 'red');
  }

  ngOnInit() {
    this.familiaService.cantidadFamilias()
       .subscribe(
         res => {
           this.numPags = Math.ceil(Number(res) / this.limite);
           this.pags = Array.from(Array(this.numPags)).map((x, i) => i + 1);
           console.log(this.pags);
         }
       )
    this.obtenerFamilias('Nombre');
  }

}
