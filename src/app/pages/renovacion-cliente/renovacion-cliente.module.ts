import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RenovacionClientePageRoutingModule } from './renovacion-cliente-routing.module';
import { RenovacionClientePage } from './renovacion-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RenovacionClientePageRoutingModule
  ],
  declarations: [RenovacionClientePage]
})
export class RenovacionClientePageModule {}
