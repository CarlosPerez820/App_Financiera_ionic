import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoPrestamoPage } from './pago-prestamo.page';

const routes: Routes = [
  {
    path: '',
    component: PagoPrestamoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoPrestamoPageRoutingModule {}
