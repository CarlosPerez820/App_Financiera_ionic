import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPagosPage } from './editar-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPagosPageRoutingModule {}
