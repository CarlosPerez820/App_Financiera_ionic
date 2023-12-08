import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenovacionPageRoutingModule } from './renovacion-routing.module';

import { RenovacionPage } from './renovacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenovacionPageRoutingModule
  ],
  declarations: [RenovacionPage]
})
export class RenovacionPageModule {}
