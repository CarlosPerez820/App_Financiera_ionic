import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
    
import { CustomFormsModule } from 'ng2-validation';
import {HttpClientModule} from '@angular/common/http'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileOriginal } from '@awesome-cordova-plugins/file';
//import { FileOpenerOriginal } from '@awesome-cordova-plugins/file-opener';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener';

//import { File } from '@awesome-cordova-plugins/file';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener';


@NgModule({
  declarations: [AppComponent],
  imports: [
   // CustomFormsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation, 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
