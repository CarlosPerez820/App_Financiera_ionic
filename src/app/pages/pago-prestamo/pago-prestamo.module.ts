import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoPrestamoPageRoutingModule } from './pago-prestamo-routing.module';

import { PagoPrestamoPage } from './pago-prestamo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoPrestamoPageRoutingModule
  ],
  declarations: [PagoPrestamoPage]
})
export class PagoPrestamoPageModule {}
