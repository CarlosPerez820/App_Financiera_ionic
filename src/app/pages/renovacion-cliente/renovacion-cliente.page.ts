import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { AlertController } from '@ionic/angular';
import { Clientes, Renovaciones, Solicitudes } from 'src/app/interfaces/interfaces';
import { RenovacionService } from 'src/app/services/renovacion.service';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteresService } from 'src/app/services/interes.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';



var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;



@Component({
  selector: 'app-renovacion-cliente',
  templateUrl: './renovacion-cliente.page.html',
  styleUrls: ['./renovacion-cliente.page.scss'],
})
export class RenovacionClientePage implements OnInit {

  
  //Variables Globales
  id: any;
  urlWhats: string='';
  objeto:any=[];
  clienteEspecifico:any = [];
  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera  = this.sharedService.getFinanciera();
  form: FormGroup;
  fecha_Solicitud = fechaDia;
  telefonoCliente: any;
  numeroDeClienteID: any;
  valorProceso=0;
  mongoIdCliente:any;
  listaDeInteres: any = [];
  lista: any = [];
  
  listaTasaDiaria:any =[];
  listaTasaSemanal: any =[];

  constructor(
    private clientesServices:ClientesService,
    private renovacionesServices: RenovacionService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private solicitudServicio: SolicitudesService,
    private interesService: InteresService,
    private router:Router,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
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
      senasDomicilio: ['',Validators.required],
      ciudad: ['',Validators.required],
      celular: ['',Validators.required],
      telefonoFijo: ['',Validators.required],
      telefonoAdicional: ['',Validators.required],
      estadoCivil: ['',Validators.required],
      tiempoCasados: ['',Validators.required],
      dependientes: ['',Validators.required],
      tipoVivienda: ['',Validators.required],
      tiempoVivienda: ['',Validators.required],
      pagoRenta: ['',Validators.required],
      tipoNegocio: ['',Validators.required],
      tiempoNegocio: ['',Validators.required],
      numeroINE: ['',Validators.required],
      RFC: ['',Validators.required],
      conyugue: ['',Validators.required],
      trabajoConyugue: ['',Validators.required],
      domicilioConyugue: ['',Validators.required],
      antiguedadConyugue: ['',Validators.required],
      ingresoSolicitante: ['',Validators.required],
      ingresosConyugue: ['',Validators.required],
      gastos: ['',Validators.required],
      creditosActuales: ['',Validators.required],
      motivos: ['',Validators.required],
      gestor: [this.correoAsesor,Validators.required],
      tipoPrestamo: ['',Validators.required],
    })
   }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);
    this.obtenerClienteEspecifico(this.id);
    this.obtenerListaDeInteres();
  }

  obtenerClienteEspecifico(id: string){
    this.clientesServices.getClienteEspecifico(id)
    .subscribe( data => {
      this.objeto = data;
      this.clienteEspecifico = this.objeto.cliente;
      console.log(this.clienteEspecifico);
      this.llenarFormulario();
    })
  }

  async alertaFallido() {
    const alert = await this.alertController.create({
      header: 'SOLICITUD FALLIDA',
      message: 'La solicitud de renovación no fue creada',
      buttons: ['OK']

    });

    await alert.present();
  }

  async alertaCreado() {
    const alert = await this.alertController.create({
      header: 'Solicitud',
      message: 'Su solicitud fue enviada para revisión',
      buttons: ['OK']

    });

    await alert.present();
  }

  enviarSolicitudRenovacion(){
    const solicitud: Solicitudes = {
      fechaSolicitud: this.form.value.fecha,
      montoSolicitado: this.form.value.montoSolicitado,
      montoAutorizado: 0,
      totalPagar: this.form.value.totalPagar,
      pagoDiario: this.form.value.pagoDiario,
      plazo: this.form.value.plazo,

      numeroCliente: this.clienteEspecifico.numeroCliente,
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
      tipo: "Renovacion",
      tipoPrestamo: this.form.value.tipoPrestamo,
      sucursal: this.sucursalFinanciera
  }

  console.log(solicitud);
  this.solicitudServicio.guardarSolicitud(solicitud).subscribe(response => {

    if(response){
      this.alertaCreado();
    //  this.router.navigate(['/clientes']);
      this.avisoSMS();
    }
  }, error => {
    console.log(error); 
    this.alertaFallido();    
  });
  }

  llenarFormulario(){
    console.log(this.clienteEspecifico.nombre);
    this.form.patchValue({
      nombreSolicitante: this.clienteEspecifico.nombre,
      edad: this.clienteEspecifico.edad,
      direccion:  this.clienteEspecifico.direccion,
      colonia:  this.clienteEspecifico.colonia,
      senasDomicilio:  this.clienteEspecifico.senasDomicilio,
      ciudad:  this.clienteEspecifico.ciudad,
      celular:  this.clienteEspecifico.celular,
      telefonoFijo:  this.clienteEspecifico.telefonoFijo,
      telefonoAdicional:  this.clienteEspecifico.telefonoAdicional,
      estadoCivil:  this.clienteEspecifico.estadoCivil,
      tiempoCasados:  this.clienteEspecifico.tiempoCasados,
      dependientes:  this.clienteEspecifico.dependientes,
      tipoVivienda:  this.clienteEspecifico.tipoVivienda,
      tiempoVivienda:  this.clienteEspecifico.tiempoViviendo,
      pagoRenta:  this.clienteEspecifico.pagoRenta,
      tipoNegocio:  this.clienteEspecifico.tipoNegocio,
      tiempoNegocio:  this.clienteEspecifico.tiempoNegocio,
      numeroINE:  this.clienteEspecifico.numeroIdentificacion,
      RFC:  this.clienteEspecifico.RFC,
      conyugue:  this.clienteEspecifico.nombreConyugue,
      trabajoConyugue:  this.clienteEspecifico.trabajoConyugue,
      domicilioConyugue:  this.clienteEspecifico.domicilioConyugue,
      antiguedadConyugue:  this.clienteEspecifico.antiguedadConyugue,
      ingresoSolicitante:  this.clienteEspecifico.ingresoSolicitante,
      ingresosConyugue:  this.clienteEspecifico.ingresoConyugue,
      gastos:  this.clienteEspecifico.gastosTotales,
      creditosActuales:  this.clienteEspecifico.numeroPrestamos,
      gestor:  this.clienteEspecifico.gestorAsignado
    });
  }

  //eliminar
  guardarRenovacion(){
    console.log("Funciona ");
    const renovacion: Renovaciones={
    }
    console.log(renovacion);
    this.renovacionesServices.guardarRenovacion(renovacion).subscribe(data => {
    
    if(data){
      console.log("Prueba de que el registro funciono");
      this.alertaCreado();
      this.router.navigate(['/clientes']);
    }
    }, error => {
      console.log(error);
      this.alertaFallido();      
    })
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

  eliminarAcentos2(n){
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

  avisoSMS(){
    let texto="Estimado Cliente su solicitud para un credito realizada por el gestor ("+this.correoAsesor+") de "+this.sucursalFinanciera+ ", fue enviada para su revicion, recuerde visitar nuestra pagina: "+
    "www.paginaPrueba.com "+"y con su numero de cliente :"+this.clienteEspecifico.numeroCliente+" ,para verificar su estado";

    let WhatsappNumero=this.form.value.celular;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);

    this.router.navigate(['/clientes']);
    window.location.assign(this.urlWhats);
  }

}
