import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CobrarCuentasPageRoutingModule } from './cobrar-cuentas-routing.module';

import { CobrarCuentasPage } from './cobrar-cuentas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CobrarCuentasPageRoutingModule
  ],
  declarations: [CobrarCuentasPage]
})
export class CobrarCuentasPageModule {}
