import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevaSolicitudPageRoutingModule } from './nueva-solicitud-routing.module';
import { NuevaSolicitudPage } from './nueva-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevaSolicitudPageRoutingModule
  ],
  declarations: [NuevaSolicitudPage]
})
export class NuevaSolicitudPageModule {}
