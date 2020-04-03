import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './empleado/empleado.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { AuthGuardGuard } from './shared/guards/auth-guard.guard';
import { CambiopasswComponent } from './cambiopassw/cambiopassw.component';
import { FamArticuloComponent } from './fam-articulo/fam-articulo.component';
import { ResetpasswComponent } from './resetpassw/resetpassw.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { Rol } from './shared/models/roles';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'empleado',
    component : EmpleadoComponent,
    canActivate: [AuthGuardGuard],
    data: {roles: [Rol.Admin]}
  },
  { path: 'cliente', 
    component: ClienteComponent,
    canActivate: [AuthGuardGuard],
    data: {roles: [Rol.Admin, Rol.PowerUser]}
  },
  { path: 'proveedor',
    component: ProveedorComponent,
    canActivate: [AuthGuardGuard],
    data: {roles: [Rol.Admin]}
  },
  {path: 'articulo',
    children: [
      { path: 'catalogo',
        component: ArticuloComponent,
        canActivate: [AuthGuardGuard],
        data: {roles: [Rol.Admin, Rol.PowerUser]}
      },
      { path: 'familia',
        component: FamArticuloComponent,
        canActivate: [AuthGuardGuard],
        data: {roles: [Rol.Admin, Rol.PowerUser]}
      }
    ]
  },
  {path: 'proc',
    children: [
      { path: 'compras', 
        component: ComprasComponent,
        canActivate: [AuthGuardGuard],
        data: {roles: [Rol.Admin, Rol.PowerUser]}
      },
      { path: 'ventas',
        component: VentasComponent,
        canActivate: [AuthGuardGuard],
        data: {roles: [Rol.Admin, Rol.User]}
      }
    ]
  },
  { path: 'usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuardGuard],
    data: {roles: [Rol.Admin]}
  },
  {path: 'cambiopassw', component: CambiopasswComponent},
  { path: 'resetpassw',
    component: ResetpasswComponent,
    canActivate: [AuthGuardGuard],
    data: {roles: [Rol.Admin]}
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
