import { Component } from '@angular/core';
import { error } from 'console';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { RegistroActividadService } from './services/registro-actividad.service';
import { Actividad } from './interfaces/interfaces';
import { NavigationEnd, Router } from '@angular/router';


var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var minutes =  today.getMinutes();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  mostrarMenu = true; // Inicialmente, se muestra el menú


  _fecha = fechaDia;
  _horaActual = `${hour}:${minutes}`;
  correoAsesor = localStorage.getItem("token");
  gestor = '';
  movimiento = "Ingreso a la app";
  lat = '0';
  lon = '0';
  urlMaps = '';

  constructor(
    private registroActividad: RegistroActividadService,
    private router: Router
  ) 
  {
    this.locate();
    console.log("El correo del asesor es: "+this.correoAsesor);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verifica si la página actual es 'PaginaEspecifica'
        if (event.url === '/login') {
          this.mostrarMenu = false; // Oculta el menú si la página es 'PaginaEspecifica'
        } else {
          this.mostrarMenu = true; // Muestra el menú en otras páginas
        }
      }
    });
  }


 /* getGeolocation(){

    console.log("Funciona la Geolocalizacion");

    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
    };
    
  }*/


  locate(){
    Geolocation.getCurrentPosition().then((resp) => {    
      this.lat=resp.coords.latitude.toString();  
      this.lon=resp.coords.longitude.toString();
      console.log("Las coordenadas son: "+this.lat+"/"+this.lon);

     // this.registrarActividad();
    });
  
  }


  /*registrarActividad(){

    if(this.correoAsesor!=null){
      this.gestor=this.correoAsesor;
    }

    this.urlMaps = "https://www.google.com/maps/search/?api=1&query="+this.lat+","+this.lon+"&zoom=20";

    const actividad: Actividad = {
      fecha: this._fecha,
      hora: this._horaActual,
      gestor: this.gestor,
      movimiento: this.movimiento,
      latitud: this.lat,
      longitud: this.lon,
      link: this.urlMaps,
    }
    //console.log("Las coordenadas son: Lat - "+this.lat);
    console.log(actividad);

    this.registroActividad.guardarRegistro(actividad).subscribe(data => {
      if(data){
        console.log("Exitoso Ubicacion !!!!");
      }
    }, error => {
      console.log(error);
    }) 
  }*/



}
