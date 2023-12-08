import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabuladorPageRoutingModule } from './tabulador-routing.module';

import { TabuladorPage } from './tabulador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabuladorPageRoutingModule
  ],
  declarations: [TabuladorPage]
})
export class TabuladorPageModule {}
