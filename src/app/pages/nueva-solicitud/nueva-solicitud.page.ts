import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Console, error } from 'console';
import { AlertController } from '@ionic/angular';
import { Clientes, Seguimiento } from 'src/app/interfaces/interfaces';
import { ApiResponse } from 'src/app/interfaces/interfaces';
import { Solicitudes } from 'src/app/interfaces/interfaces';
import { Actividad } from 'src/app/interfaces/interfaces';
import { ClientesService } from 'src/app/services/clientes.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RestServiceService } from 'src/app/services/rest-service.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { RegistroActividadService } from 'src/app/services/registro-actividad.service';
import { ImageCompressor } from 'image-compressor';
import {NgxImageCompressService} from 'ngx-image-compress';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadService } from 'src/app/services/upload.service';
import { InteresService } from 'src/app/services/interes.service';


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
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.page.html',
  styleUrls: ['./nueva-solicitud.page.scss'],
})
export class NuevaSolicitudPage implements OnInit {

  //vuelve visible/invisible las card
  activo=false;
  
  //Parametros para registro de actividad
  _horaActual = `${hour}:${minutes}`;
  movimiento = "Registro una solicitud";
  lat:string = '0';
  lon:string = '0';
  fecha_Solicitud: string =fechaDia;
  
  urlWhats: string='';
  urlMaps: string=''; 


  //Variables Globales
  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera  = this.sharedService.getFinanciera();
  form: FormGroup;
  telefonoCliente: any;
  numeroDeClienteID: any;
  valorProceso=0;
  mongoIdCliente:any;
  listaDeInteres: any = [];
  lista: any = [];

  listaTasaDiaria:any =[];
  listaTasaSemanal: any =[];

  //antiguio
  private fileTmp:any;

  nombreCorregido: string ='';
  gestor: string='';
  miModelo: any;


  constructor(
    private solicitudServicio:SolicitudesService, 
    private clienteService:ClientesService, 
    private registroActividad: RegistroActividadService, 
    private sharedService: SharedService,
    private uploadService: UploadService,
    private restService: RestServiceService,
    private interesService: InteresService,
    private alertController: AlertController,
    private router:Router,
    private imageCompress: NgxImageCompressService,
    private fb: FormBuilder,
    private reactivefm: ReactiveFormsModule)  
    {
      this.miModelo={};

      this.form=this.fb.group({
        fecha: [this.fecha_Solicitud,Validators.required],
        montoSolicitado: ['',Validators.required],
        totalPagar: ['',Validators.required],
        pagoDiario: ['',Validators.required],
        plazo: ['',Validators.required],
        nombreSolicitante: ['',Validators.required],
        edad: ['',Validators.required],
        direccion: ['',Validators.required],
        colonia: ['',Validators.required],
        senasDomicilio: [''],
        entreCalles: [''],
        ciudad: ['',Validators.required],
        celular: ['',Validators.required],
        telefonoFijo: [''],
        telefonoAdicional: [''],
        estadoCivil: ['',Validators.required],
        tiempoCasados: ['',Validators.required],
        dependientes: ['',Validators.required],
        tipoVivienda: ['',Validators.required],
        tiempoVivienda: [''],
        pagoRenta: [''],
        tipoNegocio: ['',Validators.required],
        tiempoNegocio: [''],
        numeroINE: ['',Validators.required],
        RFC: ['',Validators.required],
        conyugue: ['',Validators.required],
        trabajoConyugue: [''],
        domicilioConyugue: [''],
        antiguedadConyugue: [''],
        ingresoSolicitante: ['',Validators.required],
        ingresosConyugue: [''],
        gastos: ['',Validators.required],
        creditosActuales: [''],
        motivos: ['',Validators.required],
        gestor: [this.correoAsesor,Validators.required],
        tipoPrestamo: ['', Validators.required],
      })
   }

    imgResultBeforeCompression: string = '';
    sizeAntes: number=0;
    sizeDespues: number=0;
    imgResultAfterCompression: string = '';
    imgResult: string = '';

  ngOnInit() {
    this.locate();

    console.log("EL nombre del gestor es : "+ this.sharedService.getUsername());
    this.obtenerListaDeInteres();
  }

  verificarCamposOpcionales(){
     // Verificar los campos opcionales y asignar valores por defecto si están vacíos
     const camposOpcionalesTexto = ['senasDomicilio', 'entreCalles', 'telefonoFijo', 'telefonoAdicional', 
     'tiempoVivienda', 'pagoRenta', 'tiempoNegocio', 'trabajoConyugue', 'domicilioConyugue', 'antiguedadConyugue'];

     camposOpcionalesTexto.forEach((campo) => {
      const campoControl = this.form?.get(campo);
      if (campoControl && !campoControl.value) {
        campoControl.setValue('SN');
      }
    });
    
    const camposOpcionalesNumeros = ['ingresosConyugue', 'creditosActuales'];

    camposOpcionalesNumeros.forEach((campo) => {
     const campoControl = this.form?.get(campo);
     if (campoControl && !campoControl.value) {
       campoControl.setValue(0);
     }
   });

  }

  ingresar(){
    this.enviarNuevoCliente();
  }

  enviarNuevoCliente(){
    
    this.verificarCamposOpcionales();

     this.numeroDeClienteID = this.eliminarAcentos2(this.form.value.nombreSolicitante).substring(0, 2)+year+month+day+hour+minutes+segundes;

    const cliente: Clientes = {
      numeroCliente: this.numeroDeClienteID,
      nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
      edad: this.form.value.edad,
      direccion: this.form.value.direccion,
      colonia: this.form.value.colonia,
      senasDomicilio: this.form.value.senasDomicilio,
      entrecalles: this.form.value.entreCalles,
      ciudad: this.form.value.ciudad,
      celular: this.form.value.celular,
      telefonoFijo: this.form.value.telefonoFijo,
      telefonoAdicional: this.form.value.telefonoAdicional,
      estadoCivil: this.form.value.estadoCivil,
      tiempoCasados: this.form.value.tiempoCasados,
      dependientes: this.form.value.dependientes,
      tipoVivienda: this.form.value.tipoVivienda,
      tiempoViviendo: this.form.value.tiempoVivienda,
      pagoRenta: this.form.value.pagoRenta,
      tipoNegocio: this.form.value.tipoNegocio,
      tiempoNegocio: this.form.value.tiempoNegocio,
      numeroIdentificacion: this.form.value.numeroINE,
      RFC: this.form.value.RFC,
      nombreConyugue: this.form.value.conyugue,
      trabajoConyugue: this.form.value.trabajoConyugue,
      domicilioConyugue: this.form.value.domicilioConyugue,
      antiguedadConyugue: this.form.value.antiguedadConyugue,
      ingresoSolicitante: this.form.value.ingresoSolicitante,
      ingresoConyugue: this.form.value.ingresosConyugue,
      gastosTotales: this.form.value.gastos,
      gestorAsignado: this.form.value.gestor,
      fotoComprobante: "URL",
      fotoFachada: "URL",
      fotoIneFrente: "URL",
      fotoIneReverso: "URL",
      tipo: "SN",
      fechaRegistro: this.form.value.fecha,
      numeroPrestamos: this.form.value.creditosActuales,
      numeroActivos:0,
      prestamosActivos:false,
      clasificacion:"Pendiente",
      sucursal: this.sucursalFinanciera
    }
    console.log(cliente);

    this.clienteService.guardarCliente(cliente).subscribe(
      (response) => {
      
      //console.log('Cliente registrado con éxito:', response);
      const _idCliente = response.cliente._id;
      //console.log("El id del nuevo cliente es "+_idCliente);
      this.mongoIdCliente = _idCliente;
      this.activo=true;

      this.registrarMovimiento(`Registro de nuevo cliente: ${this.form.value.nombreSolicitante}`);

      this.enviarSolcitud();

    },
    (error) => {
      console.error('Error al registrar cliente:', error);
    }
  );
  }

  enviarSolcitud(){
    
    this.verificarCamposOpcionales();

    const solicitud: Solicitudes = {
        fechaSolicitud: this.form.value.fecha,
        montoSolicitado: this.form.value.montoSolicitado,
        montoAutorizado: 0,
        totalPagar: this.form.value.totalPagar,
        pagoDiario: this.form.value.pagoDiario,
        plazo: this.form.value.plazo,

        numeroCliente: this.numeroDeClienteID,
        nombre: this.eliminarAcentos2(this.form.value.nombreSolicitante),
        edad: this.form.value.edad,
        direccion: this.form.value.direccion,
        colonia: this.form.value.colonia,
        senasDomicilio: this.form.value.senasDomicilio,
        entrecalles: this.form.value.entreCalles,
        ciudad: this.form.value.ciudad,
        celular: this.form.value.celular,
        telefonoFijo: this.form.value.telefonoFijo,
        telefonoAdicional: this.form.value.telefonoAdicional,
        estadoCivil: this.form.value.estadoCivil,
        tiempoCasados: this.form.value.tiempoCasados,
        dependientes: this.form.value.dependientes,
        tipoVivienda: this.form.value.tipoVivienda,
        tiempoViviendo: this.form.value.tiempoVivienda,
        pagoRenta: this.form.value.pagoRenta,
        tipoNegocio: this.form.value.tipoNegocio,
        tiempoNegocio: this.form.value.tiempoNegocio,
        numeroIdentificacion: this.form.value.numeroINE,
        RFC: this.form.value.RFC,
        nombreConyugue: this.form.value.conyugue,
        trabajoConyugue: this.form.value.trabajoConyugue,
        domicilioConyugue: this.form.value.domicilioConyugue,
        antiguedadConyugue: this.form.value.antiguedadConyugue,
        ingresoSolicitante: this.form.value.ingresoSolicitante,
        ingresoConyugue: this.form.value.ingresosConyugue,
        gastosTotales: this.form.value.gastos,
        gestorAsignado: this.form.value.gestor,
        infoCredito: this.form.value.motivos,
        estatus: "Pendiente",
        tipo: "Nueva",
        sucursal: this.sucursalFinanciera
    }

    console.log(solicitud);
    this.solicitudServicio.guardarSolicitud(solicitud).subscribe(response => {

      if(response){
        this.registrarMovimiento(`Registro de nueva solicitud del cliente: ${this.form.value.nombreSolicitante}`);
        this.alertaExitosa();
      }
    }, error => {
      console.log(error); 
      this.alertaFallido();    
    });
  }

  locate(){
    Geolocation.getCurrentPosition().then((resp) => {    
      this.lat=resp.coords.latitude.toString();  
      this.lon=resp.coords.longitude.toString();
      console.log("Las coordenadas son: "+this.lat+"/"+this.lon);
    });
  }

  compressFile() {
    console.log("**************************************************** Prueba de comprimir*******************************");
    this.imageCompress.uploadFile().then(({image, orientation}) => {
        this.imgResultBeforeCompression = image;
        console.log("***********************************************************************");
        console.log(this.imgResultBeforeCompression);
        console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));
        this.sizeAntes = this.imageCompress.byteCount(image);

        this.imageCompress
            .compressFile(image, orientation, 50, 40) // 50% ratio, 50% quality
            .then(compressedImage => {
                this.imgResultAfterCompression = compressedImage;
                console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
                this.sizeDespues = this.imageCompress.byteCount(compressedImage);
            });
    });
}

  obtenerRegistro(){
    this.registroActividad.getActividad()
    .subscribe( data => {
     console.log( data );
      //this.resultado = this.listaClientes;
    })
  }

  async alertaFallido() {
    const alert = await this.alertController.create({
      header: 'SOLICITUD FALLIDA',
      message: 'La solicitud no fue creada',
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

  
  async alertaExitosa() {
    const alert = await this.alertController.create({
      header: 'SOLICITUD CREADA',
      message: 'Su solicitud fue creada y enviada para revisión',
      buttons: ['OK']

    });

    await alert.present();
  }

  guardarClienteSolicitud(){
    this.guardarSolicitud();
    this.guardarCliente();
  }

  //Ya no sirve
  guardarSolicitud(){
    const solicitud: Solicitudes = {
    }

    console.log(solicitud);

    this.solicitudServicio.guardarSolicitud(solicitud).subscribe(data => {

      if(data){

        this.movimiento="Se genero una solicitud Exitosa";
        //this.registrarMovimiento();
        this.alertaExitosa();
        this.router.navigate(['/clientes']);

        //Se agrego el mensaje de aviso sobre una nueva solicitud
        this.avisoSMS();
        window.location.assign(this.urlWhats);
      }
    }, error => {
      console.log(error); 
      this.alertaFallido();    

      this.movimiento="Se intento generar una solicitud fallida";

      this.registrarMovimiento("Registro de prueba");
    }
    )
  
  }

  registrarMovimiento(movimient: string){
    if(this.correoAsesor!=null){
      this.gestor=this.correoAsesor;
    }

    const seguimiento: Seguimiento={
      gestor: this.gestor,
      fecha: fechaDia,
      hora:this._horaActual,
      latitud: this.lat,
      longitud: this.lon,
      actividad: movimient,
      sucursal: this.sucursalFinanciera,
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

  guardarCliente(){

    if(this.correoAsesor!=null){
      this.gestor=this.correoAsesor;
    }

    const cliente: Clientes = {
           }

    console.log(cliente);

    this.clienteService.guardarCliente(cliente).subscribe(data => {
    }, error => {
      console.log(error); 
      //this.alertaFallido();    
    }
    )
  }


  getFile($event: any): void {
    //TODO esto captura el archivo!
    const [ file ] = $event.target.files;
    this.fileTmp = {
      fileRaw:file,
      //fileName:file.name
      fileName: this.nombreCorregido +"_"+ "FOTO" + ".jpg"
    }

    console.log(this.fileTmp.fileName)
  }

  pruebafuncion(){
    console.log(this.fileTmp.fileName)
  }

  getFile2($event: any): void {
    //TODO esto captura el archivo!
    const [ file ] = $event.target.files;
    this.fileTmp = {
      fileRaw:file,
      //fileName:file.name
      fileName: this.nombreCorregido +"_"+ "COMPROBANTE_DOMICILIO" + ".jpg"
    }

    console.log(this.fileTmp.fileName)
  }


  getFile3($event: any): void {
    //TODO esto captura el archivo!
    const [ file ] = $event.target.files;
    this.fileTmp = {
      fileRaw:file,
      //fileName:file.name
      fileName:this.nombreCorregido +"_"+ "IDENTIFICACION" + ".jpg"
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

  onFileSelected(event: any, tipo: string): void {
    const nombreArchivo = this.numeroDeClienteID+'_'+tipo;
    const _sucursalFinanciera = this.sucursalFinanciera?? "po";
    const file = event.target.files[0];

    if (file) {
      this.uploadService.uploadUpdateFile(file,this.mongoIdCliente,'clientes',_sucursalFinanciera,'clientes',nombreArchivo,tipo).then((response) => {
       // console.log('Archivo cargado con éxito ('+tipo+'):', response);
        this.alertaDocumentoSubido();
        // Realiza acciones adicionales después de la carga exitosa
        this.registrarMovimiento(`Subida de documento del cliente: ${this.form.value.nombreSolicitante}`);
      }).catch((error) => {
        console.error('Error al cargar el archivo:', error);
      });
    }
  }

  obtenerListaDeInteres() {
    this.interesService.getInteresFinanciera(this.sucursalFinanciera).subscribe(
      (data) => {
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
    let plazoNumber = this.form.value.plazo;
    let montoNumber =this.form.value.montoSolicitado;
    let interesPor = 0;
    let interesCantidad =0;
    let total=0;
    let pagoDiario = 0;
    let plazoEnMes=0;

    if(this.form.value.tipoPrestamo){

      if(this.form.value.tipoPrestamo=='Diario'){
        this.listaTasaDiaria.forEach((interes: any) => {
          if(montoNumber>interes.limiteInferior && montoNumber<=interes.limiteSuperior){
            interesPor=interes.porcentaje;
            interesCantidad = Math.round((montoNumber*interesPor)/100);
    
            total=(montoNumber+interesCantidad);
            this.form.get('totalPagar')?.setValue(total);
    
            pagoDiario=(Math.round((montoNumber+interesCantidad)/plazoNumber));
            this.form.get('pagoDiario')?.setValue(pagoDiario);
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
            this.form.get('totalPagar')?.setValue(total);

            pagoDiario=(Math.round((total)/plazoNumber));
            this.form.get('pagoDiario')?.setValue(pagoDiario);
          }
        });
      }
    }
    else{
      alert('Por favor selecciona un tipo de prestamo');
    }
  }


  avisoSMS(){
    let texto="Estimado Cliente su solicitud para un credito realizada por el gestor ("+this.correoAsesor+") de "+this.sucursalFinanciera+ ", fue enviada para su revicion, recuerde visitar nuestra pagina: "+
    "www.paginaPrueba.com "+"y con su numero de cliente :"+this.numeroDeClienteID+" ,para verificar su estado";

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);

    this.router.navigate(['/clientes']);
    window.location.assign(this.urlWhats);
  }

  eliminarAcentos2(n){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }


}
