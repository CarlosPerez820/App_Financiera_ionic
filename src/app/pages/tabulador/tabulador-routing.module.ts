import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabuladorPage } from './tabulador.page';

const routes: Routes = [
  {
    path: '',
    component: TabuladorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabuladorPageRoutingModule {}
