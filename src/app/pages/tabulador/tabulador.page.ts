import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { Console } from 'console';
import { InteresService } from 'src/app/services/interes.service';
import { SharedService } from 'src/app/services/shared.service';

var today = new Date();

@Component({
  selector: 'app-tabulador',
  templateUrl: './tabulador.page.html',
  styleUrls: ['./tabulador.page.scss'],
  
})
export class TabuladorPage implements OnInit {

  //Variables Globales
  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera  = this.sharedService.getFinanciera();
  lista: any = [];
  listaDeInteres: any = [];

  movimiento = "Ingreso a la app";
  lat:number = 0;
  lon:number = 0;


  plazo: string = '';
  montoSolicitado: string ='';
  total: string = '';
  pagoDiario: string = '';
  tipoPrestamo: string = '';

  listaTasaDiaria:any =[];
  listaTasaSemanal: any =[];

  constructor(private interesService: InteresService, private sharedService: SharedService) { }

  ngOnInit() {
    this.obtenerListaDeInteres();
  }

  locate(){
    Geolocation.getCurrentPosition().then((resp) => {
      console.log('Latitud: ' + resp.coords.latitude);
      this.lat=resp.coords.latitude;
      console.log('Longitud: ' + resp.coords.longitude);
      this.lon=resp.coords.longitude;
    });

    console.log(today.getHours()+":"+today.getMinutes());
    console.log(today.getDate()+"-"+(today.getMonth() + 1)+"-"+today.getFullYear());
    console.log(this.correoAsesor);
    console.log(this.movimiento);
  }


  obtenerListaDeInteres() {
    this.interesService.getInteresFinanciera(this.sucursalFinanciera).subscribe(
      (data) => {
        console.log(data);
        this.lista = data;
        this.listaDeInteres = this.lista.intereces;
        this.seleccionarTasas();
      },
      (error) => {
        console.error('Error al obtener la lista de precios:', error);
      }
    );
  }

  seleccionarTasas(){
    for (let index = 0; index < this.listaDeInteres.length; index++) {
      if (this.listaDeInteres[index].tipo=='Diario') {
        this.listaTasaDiaria.push(this.listaDeInteres[index]);
      } else {
        this.listaTasaSemanal.push(this.listaDeInteres[index]);
      }  
    }
  }

  calcularMontos(){
    let plazoNumber = Number(this.plazo);
    let montoNumber = Number(this.montoSolicitado);
    let interesPor = 0;
    let interesCantidad =0;
    let total=0;
    let pagoDiario = 0;
    let plazoEnMes=0;

    if(this.tipoPrestamo){

      if(this.tipoPrestamo=='Diario'){
        this.listaTasaDiaria.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;
            interesCantidad = Math.round((montoNumber*interesPor)/100);
    
            total=(montoNumber+interesCantidad);
            this.total = String(total);
    
            pagoDiario=(Math.round((montoNumber+interesCantidad)/plazoNumber));
            this.pagoDiario = String(pagoDiario);
          }
        });
      }
      else{
        this.listaTasaSemanal.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;

            plazoEnMes = plazoNumber/4;

            interesCantidad  = Math.round((montoNumber*interesPor)/100);
            total=montoNumber+Math.round(interesCantidad*plazoEnMes);
            this.total = String(total);

            pagoDiario=(Math.round((total)/plazoNumber));
            this.pagoDiario = String(pagoDiario);
          }
        });
      }
    }
    else{
      alert('Por favor selecciona un tipo de prestamo');
    }
  }

  limpiar(){
    this.plazo= '';
    this.montoSolicitado ='';
    this.total  = '';
    this.pagoDiario = '';
  }


}
