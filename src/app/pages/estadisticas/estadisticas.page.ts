import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago.service';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { AlertController } from '@ionic/angular';
import { RenovacionService } from 'src/app/services/renovacion.service';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
//import jsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@awesome-cordova-plugins/file';
import { FileOpener } from '@awesome-cordova-plugins/file-opener';
import { buffer } from 'rxjs';
import { writeFile } from 'fs';
import { SharedService } from 'src/app/services/shared.service';
import { Solicitudes } from '../../interfaces/interfaces';


var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera = this.sharedService.getFinanciera();

  pdfObject: any;
  nombrePDF:string='';
  listaCuentasPagadas:any=[];
  listaCuentasFaltantes:any=[];
  cuentasxCobrar='';
  cuentasCobradas='';

  porcentaje='';

  dispositivo = '';
  contadorPrestamos = '';
  contadorNumeroPrestamos = 0;

  // muestra la fecha de hoy en formato `MM/DD/YYYY`
  fechaDia = `${day}-${month}-${year}`;
  fechaReporte= this.fechaDia;

  correo_asesor: string = '';

  totalCartera  = 0;
  totalInvertido = 0;
  totalCobrar = 0;
  totalCobrarDia = 0;
  totalGanancia = 0;


  tt = 0;

  totalDia = 0;
  totalDiaCobradoHoy = 0;
  
  totalCobradoXdia = 0;
  totalSolicitudesDia = 0;
  totalRenovacionesDia = 0;
  totalGeneral :any;

  pagosDelDia = 0;
  solicitudesDelDia = 0;
  renovacionesDelDia = 0;

  totalFinal = 0;

  //General
  listaRenovaciones: any= [];
  listaPagos:any = [];
  listaPrestamos: any = [];
  listaSolicitudes: any=[];
  //Gestor
  pagosEspecificos: any = [];
  solicitudesEspecificas:any =[];
  prestamosEspecificos: any = [];
  renovacionesEspecificas: any=[];

  //listasGenericas
  listaGpagos: any=[];
  listaGsolicitud: any =[];
  listaGprestamo: any =[];
  //Del dia
  listaPagosDia: any = [];
  listaSolicitudesDia: any = [];
  listaRenovacionesDia: any =[];

  
  

  constructor(
    private pagoService: PagoService,
    private solicitudService: SolicitudesService,
    private renovacionService: RenovacionService,
    private prestamoService: PrestamoService,
    private alertController: AlertController,
    private sharedService: SharedService,
    //private file: File,
    //private fileO: FileOpenerOriginal,
    private platform: Platform

   // private geolocation: Geolocation
  ) { }

  ngOnInit() {
/*  this.obtenerPagos();
    this.obtenerSolicitudes();
    this.obtenerRenovaciones();
    this.obtenerPrestamos();
    this.recolectadoDia(this.fechaDia);
    this.solicitudesRealizadasDia(this.fechaDia);
    this.renovacionesRealizadasDia(this.fechaDia);
    this.informeDia(this.fechaDia);
*/
    this.obtenerPrestamos();
    this.obtenerPagos(this.fechaDia);
  }

  getGeolocation(){
    console.log("Funciona la Geolocalizacion");
    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      //console.log('Current position:', coordinates);
      this.tt=1;
    }
    console.log();
  }

  async alertaGenerado() {
    const alert = await this.alertController.create({
      header: 'Generado exitosamente',
      message: this.nombrePDF,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertaFallo() {
    const alert = await this.alertController.create({
      header: 'No se a encontrado ningun PDF',
      message: 'Recuerda primero generar tu archivo',
      buttons: ['OK']
    });
    await alert.present();
  }

  openFile(){
    if(this.platform.is('cordova')){
      //alert("Estas en un android");
     // this.dispositivo='si';
    // console.log("si es un dispositivo movil");
    this.pdfObject.getBuffer((buffer)=> {
      var blob = new Blob([buffer], {type: 'application/pdf'});

      File.writeFile(File.dataDirectory, this.nombrePDF, blob, {replace:true}).then(fileEntry => {

        FileOpener.open(File.dataDirectory +this.nombrePDF,'application/pdf');
      });
      });
     }

     if(this.pdfObject){
      this.pdfObject.download();
      console.log(this.nombrePDF);
     }
     else{
      console.log("No existe un Documento.PDF");
     }      
  }

  generaPDF(){

    let docDefinition ={
      content: [
        {	
          text: 'Reporte de cobros y movimientos - '+this.fechaReporte+ '\n' + this.correoAsesor+'\n\n', 
          style: 'header',
          alignment: 'center'
        },
        {
          text: 'Estadisticas de la cartera de clientes: \n',
          style: 'subheader',
          alignment: 'center'

        },
        {
          text: '\n Actualmente el valor de la cartera de esta ruta es de $ '+this.totalCartera,
          style: 'subheader',

        },
        {
          text: '\n Actualmente la cartera de esta ruta cuenta con  '+this.contadorNumeroPrestamos+' cuentas de prestamos activos',

        },
        {
          text: '\n El total de cuentas a cobrar en el dia eran: '  + this.contadorNumeroPrestamos+ '\n'+
          'El total en dinero a cobrar en el dia era: $'+this.totalCobrarDia + '\n' + 
          'El total de cuentas cobradas fueron: '+this.listaPagosDia.length + '\n' + 
          'El total cobrado en el dia fue de : $' + this.totalDiaCobradoHoy + '\n' + 
          'El numero de cuentas faltantes por cobrar son : ' + this.cuentasxCobrar + '\n' + 
          'Falto cobrar una cantidad de: $' + (this.totalCobrarDia-this.totalDiaCobradoHoy).toString()+ '\n\n',

        },
        {
          text: '\n EL PORCENTAJE DE EFECTIVIDAD ES UN '+this.porcentaje+'%',
          style: 'subheader',
          alignment: 'center'

        },
        {
          text: '\n Movimientos del Dia',
          style: 'subheader',

        },
        {
          style: 'tableExample',
          table: {
            body: [
              ['Pagos', 'Solicitudes'],
              [this.listaPagosDia.length,this.solicitudesDelDia],
              ['$'+this.totalDiaCobradoHoy, '$'+this.totalSolicitudesDia]
            ]
          }
        },
        {
          text: '\n Pagos recolectados',
          style: 'subheader',
        },
        {
          style: 'tableExample',
          table: {
            body: [
              ['Cliente', 'Folio', 'Abono'],
              ...this.listaPagosDia.map(item => [item.nombreCliente, item.folio, '$'+item.abono])
            ]
          }
        },
        {
          text: '\n Cuentas que faltaron por cobrar',
          style: 'subheader',
        },
        {
          style: 'tableExample',
          table: {
            body: [
              ['Cliente', 'Folio', 'Monto'],
              ...this.listaCuentasFaltantes.map(item => [item.nombre, item.folio, '$'+item.pagoDiario])
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        }
      }
    };

    this.pdfObject = pdfMake.createPdf(docDefinition);
    this.nombrePDF='Reporte_'+this.correoAsesor+'_'+this.fechaReporte;
    this.alertaGenerado();
  }

  obtenerPagos(fechaPago){
    this.pagoService.getPagosFinanciera(this.sucursalFinanciera,fechaPago).subscribe(data =>{
      this.listaGpagos = data;
      this.listaPagos = this.listaGpagos.pagos;
      this.buscarPago();

      if(this.listaPagosDia.length ==0){
        this.listaPagosDia=this.listaPagos
        this.recolectadoDia();
      }
    });
  }

  obtenerPrestamos(){
    this.prestamoService.getPrestamosFinanciera(this.sucursalFinanciera).subscribe(data => {
      this.listaGprestamo = data;
      this.listaPrestamos = this.listaGprestamo.prestamos;

      this.seleccionarPrestamos(this.fechaDia);
    })
  }

  obtenerSolicitudes(fechaSolicit){
    this.solicitudService.getSolicitudesFinancieraDia(this.sucursalFinanciera, fechaSolicit).subscribe(data =>{
      this.listaGsolicitud = data;
      this.listaSolicitudes = this.listaGsolicitud.solicitudes;

      this.buscarSolicitud();
    })
  }

  handleRefresh(event: any) {
    setTimeout(() => {

      this.listaPagosDia=[];

      this.obtenerPagos(this.fechaReporte);
      this.obtenerSolicitudes(this.fechaReporte);
     // this.informeDia(this.fechaDia);

      this.obtenerPrestamos();
     event.target.complete();
    }, 2000);
  };

  seleccionarPrestamos(fechaDelDia){
    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }

    this.listaCuentasPagadas=[];
    this.listaCuentasFaltantes=[];
    let contador=0;
    let contador1=0;    
    let contador2=0;

    for (let index = 0; index < this.listaPrestamos.length; index++) {    
      if (this.listaPrestamos[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase()) {
            contador1=contador1+this.listaPrestamos[index].pagoDiario;

            contador = contador+1;

            if(this.listaPrestamos[index].fechaPago==fechaDelDia) {
              this.listaCuentasPagadas.push(this.listaPrestamos[index]);
            }
            else if(this.listaPrestamos[index].tipoPrestamo=='Diario'||
            (this.listaPrestamos[index].tipoPrestamo=='Semanal' && this.listaPrestamos[index].proximoPago==fechaDelDia)) {
              this.listaCuentasFaltantes.push(this.listaPrestamos[index]);
            } 

            contador2 = contador2 + this.listaPrestamos[index].totalRestante;
      }        
    }
    this.totalCobrarDia = contador1;
    this.contadorNumeroPrestamos = contador;
    this.totalCartera = contador2;

    this.cuentasxCobrar=this.listaCuentasFaltantes.length;
    this.cuentasCobradas=this.listaCuentasPagadas.length;

    this.calcularPorcentaje(this.cuentasCobradas,this.contadorNumeroPrestamos);
  }

  calcularPorcentaje(cantidad, total){
    this.porcentaje= String(Math.round((cantidad*100)/total));
    console.log("El porcentaje es: "+this.porcentaje);
  }

  buscarPago(){
    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }

    let total = 0;
    this.pagosEspecificos=[];

    for (let index = 0; index < this.listaPagos.length; index++) {
      if (this.listaPagos[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase()) {  
        this.pagosEspecificos.push(this.listaPagos[index]);
          total = total + this.listaPagos[index].abono;
       // this.totalGeneral=total;
      }
    }
    this.totalCobradoXdia = total;
    this.pagosDelDia=this.pagosEspecificos.length;
  }


  buscarSolicitud(){
    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }

    let total = 0;
    this.solicitudesEspecificas=[];
    this.renovacionesEspecificas=[];

    let contador1 = 0;
    let contador2 = 0;

    let sumaSolicitud=0;
    let sumaRenovacion=0;

    for (let index = 0; index < this.listaSolicitudes.length; index++) {
          
      if (this.listaSolicitudes[index].gestorAsignado.toUpperCase()==this.correo_asesor.toUpperCase()) {
        if(this.listaSolicitudes[index].tipo=="Renovacion"){
          this.renovacionesEspecificas.push(this.listaSolicitudes[index]);
          sumaRenovacion=sumaRenovacion+this.listaSolicitudes[index].montoSolicitado;  
          
        }
        else{
          this.solicitudesEspecificas.push(this.listaSolicitudes[index]);
          sumaSolicitud=sumaSolicitud+this.listaSolicitudes[index].montoSolicitado;
        }
      }
    }

    this.solicitudesDelDia = this.solicitudesEspecificas.length;
    this.renovacionesDelDia = this.renovacionesEspecificas.length;

    console.log("Solici: "+sumaSolicitud);
    console.log("Reno: "+sumaRenovacion);
    this.totalSolicitudesDia = sumaSolicitud;
    this.totalRenovacionesDia = sumaRenovacion;
  }

  
  recolectadoDia(){
    let contador1=0;
    for (let index = 0; index < this.listaPagosDia.length; index++) {
        if (this.listaPagosDia[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase()) {   
          contador1=contador1+this.listaPagosDia[index].abono;
        }
    }
    this.totalDiaCobradoHoy = contador1;
  }

  cambioFecha(event) {
    //Obtenemos la fecha del DateTime y obtenemos solo YYYY-MM-DD
      const query = event.target.value.toString().toLowerCase();
      let fechaFormato = query.substr(0, 10);

    //Convertimos YYYY-MM-DD a DD-MM-YYYY
      let nuevoFormatoFecha =  fechaFormato.split("-").reverse().join("-");

    //Descomponemos la fecha para eliminar 0
      let arregloFecha = nuevoFormatoFecha.split("-");
      let numeroSinCero;
      let numeroTexto;
      let formatoCorrecto: any = [];

      for(let index = 0; index < arregloFecha.length; index++){
          numeroSinCero = Number(arregloFecha[index]);
          numeroTexto = numeroSinCero.toString();
          formatoCorrecto.push(numeroTexto);
      }
      
    //Se crea el nuevo formato
      let fechaFinal = formatoCorrecto[0]+"-"+formatoCorrecto[1]+"-"+formatoCorrecto[2];
      this.fechaReporte =fechaFinal;

      //Termine el formato de fecha __________________________________


      this.obtenerPagos(this.fechaReporte);

      this.totalFinal= this.totalDia-(this.totalSolicitudesDia+this.totalRenovacionesDia);

      this.obtenerSolicitudes(this.fechaReporte);

  }

  informeDia(fecha){

    console.log("Funciona el N metodo");

  //    this.recolectadoDia(fecha);
      //this.solicitudesRealizadasDia(fecha);
      //this.renovacionesRealizadasDia(fecha);

      this.totalFinal= this.totalDia-(this.totalSolicitudesDia+this.totalRenovacionesDia);
  }

}
