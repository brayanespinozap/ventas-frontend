import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { CambiopasswComponent } from './cambiopassw/cambiopassw.component';
import { ResetpasswComponent } from './resetpassw/resetpassw.component';
import { ComprasComponent } from './compras/compras.component';
import { FamArticuloComponent } from './fam-articulo/fam-articulo.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { VentasComponent } from './ventas/ventas.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    EmpleadoComponent,
    HomeComponent,
    LoginComponent,
    ClienteComponent,
    ProveedorComponent,
    ArticuloComponent,
    CambiopasswComponent,
    ResetpasswComponent,
    ComprasComponent,
    FamArticuloComponent,
    UsuarioComponent,
    VentasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
