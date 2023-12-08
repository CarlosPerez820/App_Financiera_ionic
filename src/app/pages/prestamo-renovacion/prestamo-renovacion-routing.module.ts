import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestamoRenovacionPage } from './prestamo-renovacion.page';

const routes: Routes = [
  {
    path: '',
    component: PrestamoRenovacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrestamoRenovacionPageRoutingModule {}
