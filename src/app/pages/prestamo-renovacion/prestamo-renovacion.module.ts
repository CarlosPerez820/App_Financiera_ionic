import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrestamoRenovacionPageRoutingModule } from './prestamo-renovacion-routing.module';

import { PrestamoRenovacionPage } from './prestamo-renovacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrestamoRenovacionPageRoutingModule
  ],
  declarations: [PrestamoRenovacionPage]
})
export class PrestamoRenovacionPageModule {}
