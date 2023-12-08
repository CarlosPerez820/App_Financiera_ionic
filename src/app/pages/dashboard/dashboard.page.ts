import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import {DecodedToken, Seguimiento} from 'src/app/interfaces/interfaces';
import jwtDecode from 'jwt-decode'
import { NOMEM } from 'dns';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { RegistroActividadService } from 'src/app/services/registro-actividad.service';


//Obtener datos de fecha y hora
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var minutes =  today.getMinutes();
var segundes =  today.getSeconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  
  lat = '0';
  lon='0';
  gestor: string='';
  correoAsesor = this.sharedService.getUsername();
  _horaActual = `${hour}:${minutes}`;


  constructor(private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    private sharedService: SharedService,
    private registroActividad: RegistroActividadService) { }

  ngOnInit() {
    this.accederInfo();
  }

  // Para obtener el nombre de usuario
  getUserName() {
    const username = this.sharedService.getUsername();
    console.log('Nombre de usuario:', username);
  }

  accederInfo(){
    console.log(this.authService.getToken());

    const token = this.authService.getToken();

    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      //Se asignan los valores en el servicio
      this.sharedService.setUsername(decodedToken.usuario);
      this.sharedService.setFinanciera(decodedToken.sucursal);
      this.sharedService.setId(decodedToken.uid);
      this.sharedService.setNombre(decodedToken.nombre);

      this.locate();
    } else {
      console.log("No existe JWT");
    }
  }


  locate(){

    Geolocation.getCurrentPosition().then((resp) => {    
      this.lat=resp.coords.latitude.toString();  
      this.lon=resp.coords.longitude.toString();
      console.log("Las coordenadas son: "+this.lat+"/"+this.lon);
    });

    this.registrarMovimiento("Inicio de sesión");

  }

  registrarMovimiento(movimient: string){
    if(this.correoAsesor!=null){
      this.gestor=this.correoAsesor;
    }

    const seguimiento: Seguimiento={
      gestor: this.sharedService.getUsername(),
      fecha: fechaDia,
      hora:this._horaActual,
      latitud: this.lat,
      longitud: this.lon,
      actividad: movimient,
      sucursal: this.sharedService.getFinanciera(),
    }

    //console.log("Las coordenadas son: Lat - "+this.lat);
    console.log(seguimiento);

    this.registroActividad.postRegistro(seguimiento).subscribe(data => {
      if(data){
        console.log("Exitoso Ubicacion !!!!");
      }
    }, error => {
      console.log(error);
    }) 
  }

}
