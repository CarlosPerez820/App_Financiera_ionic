import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { AlertController } from '@ionic/angular';
import { PrestamoService}  from 'src/app/services/prestamo.service';
import { Prestamo } from 'src/app/interfaces/interfaces';
import { RestServiceService } from 'src/app/services/rest-service.service';
import { Solicitudes } from 'src/app/interfaces/interfaces';


var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hora = today.getHours() + today.getMinutes() + today.getSeconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

 
@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.page.html',
  styleUrls: ['./prestamo.page.scss'],
})
export class PrestamoPage implements OnInit {

  private fileTmp:any;

  id: any;
  _estatus:any;
  solicitudEspecifica:any = [];

  _fecha: string = fechaDia;
  folio: string = 'FA'+day+month+year+hora;
  nombre: string = '';
  direccion: string ='';
  colonia: string ='';
  telefonoContacto: string = '';
  cobranza: string = '';
  cantidadPrestamo: string = '';
  plazoPrestamo: string = '';
  total: string='';
  cantidadDiaria: string='';
  fechaPago: string = fechaDia;
  gestor: string = '';
  estatus: string = '';

  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private solicitudesService: SolicitudesService,
    private restService: RestServiceService,
    private prestamoService: PrestamoService,
    private alertController: AlertController
  ) { }


  async alertaFallido() {
    const alert = await this.alertController.create({
      header: 'SOLICITUD DE PRESTAMO FALLIDA',
      message: 'La solicitud de prestamo no se realizo',
      buttons: ['OK']

    });
    await alert.present();
  }

  async alertaCreado(nombre: string) {
    const alert = await this.alertController.create({
      header: nombre,
      message: 'Su prestamo fue creado y aprobado',
      buttons: ['OK']

    });
    await alert.present();
  }

  async alertaNoAprobado() {
    const alert = await this.alertController.create({
      header: 'No se puede generar su prestamo',
      message: 'Su solicitud aun no es aprobada',
      buttons: ['OK']

    });
    await alert.present();
  }


  async alertaDocumentoSubido() {
    const alert = await this.alertController.create({
      header: 'IMAGEN SUBIDA',
      message: 'La imagen se subio correctamente',
      buttons: ['OK']

    });

    await alert.present();
  }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.obtenerSolicitusEspecifica(this.id);
  }

  obtenerSolicitusEspecifica(id: string){
    this.solicitudesService.getSolicitudEspecifica(id)
    .subscribe( data => {
      console.log( data );
      this.solicitudEspecifica = data;
      //console.log(this.solicitudEspecifica.estatus);
      //console.log(this.solicitudEspecifica);
    })   

  }

  verificarEstatus(){
   // this._estatus = this.solicitudEspecifica.estatus;
    console.log("El estado es: "+this._estatus);
    if(this._estatus=='APROBADA'){
      return true;
    }
    else{
      return false;
    }
  }


  guardarPrestamo(){
    this._estatus = this.solicitudEspecifica.estatus;
    console.log(" ---- " + this._estatus);
    if(this._estatus=='APROBADA')
    {
      const prestamo: Prestamo={
        /*  fecha: this._fecha,
          folio: this.folio,
          nombre: this.nombre,
          direccion: this.direccion,
          colonia: this.colonia,
          telefono: this.telefonoContacto,
          cobranza: this.cobranza,
          cantidadprestamo: this.cantidadPrestamo,
          plazoprestamo: this.plazoPrestamo,
          totalapagar: this.total,
          totalrestante: this.total,
          pagodiario: this.cantidadDiaria,
          fechapago: this.fechaPago,
          gestor: this.gestor,
          estatus: "ACTIVO",
          urldinero:"./fotos/"+this.folio+"_"+"DINERO"+".jpg",
          urlpagare:"./fotos/"+this.folio+"_"+"PAGARE"+".jpg",
          urlfachada:"./fotos/"+this.folio+ "_"+ "FACHADA"+".jpg"
          */
      }

      console.log(prestamo);

      this.prestamoService.guardarPrestamo(prestamo).subscribe(data => {
      
      if(data){
        console.log("Prueba de que el registro funciono");
        this.actualizarSolicitudes();
        this.alertaCreado(this.nombre);
        this.router.navigate(['/clientes']);
      }
      }, error => {
        console.log(error);
        this.alertaFallido();      
      })

    }
    else{
      this.alertaNoAprobado();  
      this.router.navigate(['/solicitudes']);
    }
}


getFile($event: any): void {
    
  //TODO esto captura el archivo!
  const [ file ] = $event.target.files;
  this.fileTmp = {
    fileRaw:file,
    //fileName:file.name
    fileName: this.folio +"_"+"DINERO"+".jpg"
  }

  console.log(this.fileTmp.fileName)
}


getFile2($event: any): void {
  //TODO esto captura el archivo!
  const [ file ] = $event.target.files;
  this.fileTmp = {
    fileRaw:file,
    //fileName:file.name
    fileName: this.folio +"_"+"PAGARE"+".jpg",
  }

  console.log(this.fileTmp.fileName)
}


getFile3($event: any): void {
  //TODO esto captura el archivo!
  const [ file ] = $event.target.files;
  this.fileTmp = {
    fileRaw:file,
    //fileName:file.name
    fileName:this.folio +"_"+ "FACHADA"+".jpg"
  }
  console.log(this.fileTmp.fileName)
}

sendFile():void{
  const body = new FormData();
  body.append('myFile', this.fileTmp.fileRaw, this.fileTmp.fileName);
  //body.append('email','test@test.com')

  this.restService.sendPost(body)
  .subscribe(res => {
    console.log(res);
    this.alertaDocumentoSubido();
  }
    
  )
}


actualizarSolicitudes(){


  const solicitud: Solicitudes = {
   /*   fechaSolicitud: this.solicitudEspecifica.fecha_Solicitud,
      montoSolicitado: this.solicitudEspecifica.montoSolicitado,
      montoAutorizado: this.solicitudEspecifica.montoAutorizado,
      totalPagar: this.solicitudEspecifica.total,
      pagoDiario: this.solicitudEspecifica.pagoDiario,
      plazo: this.solicitudEspecifica.plazo,

      nombre: this.solicitudEspecifica.nombre,
      edad: this.solicitudEspecifica.edad,
      direccion: this.solicitudEspecifica.direccion,
      colonia: this.solicitudEspecifica.colonia,
      senasDomicilio: this.solicitudEspecifica.senasdomicilio,
      entrecalles: this.solicitudEspecifica.entrecalles,
      ciudad: this.solicitudEspecifica.ciudad,
      telefonoFijo: this.solicitudEspecifica.telefonofijo,
      celular: this.solicitudEspecifica.telefonocel,
      telefonoAdicional: this.solicitudEspecifica.telefonoadicional,
      estadocivil: this.solicitudEspecifica.estadocivil,
      tiempocasados: this.solicitudEspecifica.tiempocasados,
      dependientes: this.solicitudEspecifica.dependientes,
      casapropia: this.solicitudEspecifica.casapropia,
      casarentada: this.solicitudEspecifica.casarentada,
      pagorenta: this.solicitudEspecifica.pagorenta,
      tiempoviviendo: this.solicitudEspecifica.tiempoviviendo,
      casafamiliar: this.solicitudEspecifica.casafamiliar,
      tiponegocio: this.solicitudEspecifica.tiponegocio,
      cobranza: this.solicitudEspecifica.cobranza,
      tiemponegocio: this.solicitudEspecifica.tiemponegocio,
      numeroidentificacion: this.solicitudEspecifica.numeroidentificacion,
      rfc: this.solicitudEspecifica.rfc,
      conyugue: this.solicitudEspecifica.conyugue,
      trabajoconyugue: this.solicitudEspecifica.trabajoconyugue,
      domicilioconyugue: this.solicitudEspecifica.domicilioconyugue,
      antiguedadconyugue: this.solicitudEspecifica.antiguedadconyugue,
      ingresosolicitante: this.solicitudEspecifica.ingresosolicitante,
      ingresoconyugue: this.solicitudEspecifica.ingresoconyugue,
      gastostotales: this.solicitudEspecifica.gastostotales,
      gestor: this.solicitudEspecifica.gestor,

      numeroDependientes: this.solicitudEspecifica.numeroDependientes,
      infoCredito: this.solicitudEspecifica.infoCredito,
      creditosActuales: this.solicitudEspecifica.creditosActuales,
      estatus: "FINALIZADA",*/
  }

  this.solicitudesService.updateSolicitud(this.id, solicitud).subscribe(
    data =>{
      console.log("Actualizacion de la solicitud Exitoso");
    }, error => {
      console.log(error);
    })

}


}
