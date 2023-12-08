import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( (m) => m.DashboardPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('./pages/solicitudes/solicitudes.module').then( m => m.SolicitudesPageModule)
  },
  {
    path: 'pagos/:nombre/:img',
    loadChildren: () => import('./pages/pagos/pagos.module').then( m => m.PagosPageModule)
  },
  {
    path: 'renovacion',
    loadChildren: () => import('./pages/renovacion/renovacion.module').then( m => m.RenovacionPageModule)
  },
  {
    path: 'editar-pagos',
    loadChildren: () => import('./pages/editar-pagos/editar-pagos.module').then( m => m.EditarPagosPageModule)
  },
  {
    path: 'renovacion-cliente/:id',
    loadChildren: () => import('./pages/renovacion-cliente/renovacion-cliente.module').then( m => m.RenovacionClientePageModule)
  },
  {
    path: 'nueva-solicitud',
    loadChildren: () => import('./pages/nueva-solicitud/nueva-solicitud.module').then( m => m.NuevaSolicitudPageModule)
  },
  {
    path: 'prestamo/:id',
    loadChildren: () => import('./pages/prestamo/prestamo.module').then( m => m.PrestamoPageModule)
  },
  {
    path: 'prestamo-renovacion/:id',
    loadChildren: () => import('./pages/prestamo-renovacion/prestamo-renovacion.module').then( m => m.PrestamoRenovacionPageModule)
  },
  {
    path: 'historial/:nombre/:img/:numero',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'expediente/:id',
    loadChildren: () => import('./pages/expediente/expediente.module').then( m => m.ExpedientePageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },
  {
    path: 'tabulador',
    loadChildren: () => import('./pages/tabulador/tabulador.module').then( m => m.TabuladorPageModule)
  },
  {
    path: 'cobrar-cuentas',
    loadChildren: () => import('./pages/cobrar-cuentas/cobrar-cuentas.module').then( m => m.CobrarCuentasPageModule)
  },
  {
    path: 'pago-prestamo/:nombre/:folio',
    loadChildren: () => import('./pages/pago-prestamo/pago-prestamo.module').then( m => m.PagoPrestamoPageModule)
  },
  {
    path: 'upload-img',
    loadChildren: () => import('./pages/upload-img/upload-img.module').then( m => m.UploadImgPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
