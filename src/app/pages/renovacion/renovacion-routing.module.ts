import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionPage } from './renovacion.page';

const routes: Routes = [
  {
    path: '',
    component: RenovacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovacionPageRoutingModule {}
