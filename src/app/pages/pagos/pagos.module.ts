import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagosPageRoutingModule } from './pagos-routing.module';

import { PagosPage } from './pagos.page';
//import { SMS } from '@awesome-cordova-plugins/sms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagosPageRoutingModule
  ],
 // providers:[SMS],
  declarations: [PagosPage]
})
export class PagosPageModule {}
