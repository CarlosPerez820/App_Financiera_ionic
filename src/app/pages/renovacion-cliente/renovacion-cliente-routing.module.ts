import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionClientePage } from './renovacion-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: RenovacionClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovacionClientePageRoutingModule {}
