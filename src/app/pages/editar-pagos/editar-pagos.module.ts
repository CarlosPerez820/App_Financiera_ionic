import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPagosPageRoutingModule } from './editar-pagos-routing.module';

import { EditarPagosPage } from './editar-pagos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPagosPageRoutingModule
  ],
  declarations: [EditarPagosPage]
})
export class EditarPagosPageModule {}
