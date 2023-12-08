import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobrarCuentasPage } from './cobrar-cuentas.page';

const routes: Routes = [
  {
    path: '',
    component: CobrarCuentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobrarCuentasPageRoutingModule {}
