import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenovacionService } from 'src/app/services/renovacion.service';
import { AlertController } from '@ionic/angular';
import { Prestamo } from 'src/app/interfaces/interfaces';
import { PrestamoService}  from 'src/app/services/prestamo.service';
import { RestServiceService } from 'src/app/services/rest-service.service';
import { Renovaciones } from 'src/app/interfaces/interfaces';


var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hora = today.getHours() + today.getMinutes() + today.getSeconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;


@Component({
  selector: 'app-prestamo-renovacion',
  templateUrl: './prestamo-renovacion.page.html',
  styleUrls: ['./prestamo-renovacion.page.scss'],
})
export class PrestamoRenovacionPage implements OnInit {

  private fileTmp:any;

  id: any;
  _estatus:any;
  renovacionEspecifica:any = [];

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
    private renovacionService:RenovacionService,
    private restService: RestServiceService,
    private alertController: AlertController,
    private prestamoService: PrestamoService,
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("El ID es: "+this.id);
    this.obtenerRenovacionEspecifica(this.id);
  }

  obtenerRenovacionEspecifica(id: string){
    this.renovacionService.getRenovacionEspecifica(id)
    .subscribe( data => {
      console.log( data );
      this.renovacionEspecifica = data;
    })   

  }

  guardarPrestamo(){

    this._estatus = this.renovacionEspecifica.estatus;
    console.log(" ---- " + this._estatus);

    if(this._estatus=='APROBADA')
    {
      const prestamo: Prestamo={
         /* fecha: this._fecha,
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
          urlfachada:"./fotos/"+this.folio+ "_"+ "FACHADA"+".jpg"   */
      }

      console.log(prestamo);

      this.prestamoService.guardarPrestamo(prestamo).subscribe(data => {
      
        if(data){
          console.log("Prueba de que el registro funciono");
          this.actualizarRenovacion();
          this.alertaCreado(this.nombre);
          this.router.navigate(['/renovacion']);
        }
        }, error => {
          console.log(error);
          this.alertaFallido();      
        })
  
      }
      else{
        this.alertaNoAprobado();  
        this.router.navigate(['/renovacion']);
      }

  }

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
      message: 'Su fue prestamo fue creado y aprobado',
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


  actualizarRenovacion(){

    const renovacion: Renovaciones={
      fecha_Solicitud: this.renovacionEspecifica.fecha_Solicitud, 
      montoSolicitado: this.renovacionEspecifica.montoSolicitado, 
      montoAutorizado: this.renovacionEspecifica.montoAutorizado,
      total: this.renovacionEspecifica.total,
      pagoDiario:this.renovacionEspecifica.pagoDiario,
      plazo: this.renovacionEspecifica.plazo,
      
      nombre: this.renovacionEspecifica.nombre,
      edad: this.renovacionEspecifica.edad,
      direccion: this.renovacionEspecifica.direccion,
      colonia: this.renovacionEspecifica.colonia,
      señasdomicilio: this.renovacionEspecifica.senasdomicilio,
      entrecalles: this.renovacionEspecifica.entrecalles,
      ciudad: this.renovacionEspecifica.ciudad,
      telefonofijo: this.renovacionEspecifica.telefonofijo,
      telefonocel: this.renovacionEspecifica.telefonocel,
      telefonoadicional: this.renovacionEspecifica.telefonoadicional,
      estadocivil: this.renovacionEspecifica.estadocivil,
      tiempocasados: this.renovacionEspecifica.tiempocasados,
      dependientes: this.renovacionEspecifica.dependientes,
      casapropia: this.renovacionEspecifica.casapropia,
      casarentada: this.renovacionEspecifica.casarentada,
      pagorenta: this.renovacionEspecifica.pagorenta,
      tiempoviviendo: this.renovacionEspecifica.tiempoviviendo,
      casafamiliar: this.renovacionEspecifica.casafamiliar,
      tiponegocio: this.renovacionEspecifica.tiponegocio,
      cobranza: this.renovacionEspecifica.cobranza,
      tiemponegocio: this.renovacionEspecifica.tiemponegocio,
      numeroidentificacion: this.renovacionEspecifica.numeroidentificacion,
      rfc: this.renovacionEspecifica.rfc,
      conyugue: this.renovacionEspecifica.conyugue,
      trabajoconyugue: this.renovacionEspecifica.trabajoconyugue,
      domicilioconyugue: this.renovacionEspecifica.domicilioconyugue,
      antiguedadconyugue: this.renovacionEspecifica.antiguedadconyugue,
      ingresosolicitante: this.renovacionEspecifica.ingresosolicitante,
      ingresoconyugue: this.renovacionEspecifica.ingresoconyugue,
      gastostotales: this.renovacionEspecifica.gastostotales,
      gestor: this.renovacionEspecifica.gestor,
      numeroDependientes: this.renovacionEspecifica.numeroDependientes,
      infoCredito: this.renovacionEspecifica.infoCredito,
      creditosActuales: this.renovacionEspecifica.creditosActuales,
      estatus: "FINALIZADA"
    }

    this.renovacionService.updateRenovacion(this.id, renovacion).subscribe(
      data =>{
        console.log("Actualizacion de la renovacion Exitosa");
      }, error => {
        console.log(error);
      })

  }



  calcularMontos(){

    let plazoNumber = Number(this.plazoPrestamo);

    switch(plazoNumber){
        case 15:
          let credito = Number(this.cantidadPrestamo);
          this.total=String(credito*1.20);
          this.cantidadDiaria=String((credito*1.20)/15);
        break;

        case 20:
          let credito2 = Number(this.cantidadPrestamo);
          this.total=String(credito2*1.25);
          this.cantidadDiaria=String(Math.round((credito2*1.25)/20));
        break;

        case 25:
          let credito3 = Number(this.cantidadPrestamo);
          this.total=String(credito3*1.30);
          this.cantidadDiaria=String((credito3*1.30)/25);
        break;

        case 30:
          let credito4 = Number(this.cantidadPrestamo);
          this.total=String(Math.round(credito4*1.35));
          this.cantidadDiaria=String(Math.round((credito4*1.35)/30));
        break;
    }

  }



}
