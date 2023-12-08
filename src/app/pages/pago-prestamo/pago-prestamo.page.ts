import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { PagoService } from 'src/app/services/pago.service';
import { AlertController } from '@ionic/angular';
import { Prestamo, Pago, Seguimiento } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import { Actividad } from 'src/app/interfaces/interfaces';
import { RegistroActividadService } from 'src/app/services/registro-actividad.service';
import { Clientes } from 'src/app/interfaces/interfaces';

var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var minutes =  today.getMinutes();
var secons =  today.getSeconds();
var mili = today.getMilliseconds();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;

@Component({
  selector: 'app-pago-prestamo',
  templateUrl: './pago-prestamo.page.html',
  styleUrls: ['./pago-prestamo.page.scss'],
})
export class PagoPrestamoPage implements OnInit {

  tipo='';
  urlMaps = '';
  gestor: string='';
  lat = '0';
  lon='0';
  movimiento = "Registro un pago";
  correoAsesor = localStorage.getItem("token");


  nombreCorregido: any;
  _horaActual = `${hour}:${minutes}`;

  _cliente: any;
  _folio: any;
  _urlIMG: any;
  _urlFachada: any;
  WhatsappNumero: any;
  urlWhats: string='';

  _nombre: string='';
  nombre: string='';
  _fecha: string = fechaDia;
  _abono: string = '0';
  _restante: any;

  listaPrestamos:any = [];
  listaClientes:any =[];
  lista:any=[];

  lista4:any=[];
  clienteEspecifico:any=[];

  prestamoEspecifico:any = [];
  prestamosCliente:any = [];

  constructor(
    private clientesServices:ClientesService,
    private prestamoService:PrestamoService,
    private registroActividad: RegistroActividadService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private alertController: AlertController,
    private pagoService: PagoService
  ) { }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'SE AGREGO MORA',
      message: 'Se aumento $50 a su monto original',
      buttons: ['OK']
    });

    await alert.present();
  }

  async alertaPagoExitoso(cantidad: string) {
    const alert = await this.alertController.create({
      header: 'PAGO REALIZADO',
      message: 'SE REGISTRO FUE EXITOSO',
      buttons: ['OK']

    });
    await alert.present();
  }

  async alertaPagoNo() {
    const alert = await this.alertController.create({
      header: 'PAGO NO REGISTRADO',
      message: 'ESTAMOS TENIENDO PROBLEMAS PARA REGISTRAR SU PAGO',
      buttons: ['OK']

    });
    await alert.present();
  }

  ngOnInit() {
    this._cliente = this.activatedRoute.snapshot.paramMap.get("nombre");
    //console.log(this._cliente);
    this._folio = this.activatedRoute.snapshot.paramMap.get("folio");
   // console.log(this._folio);

   console.log("El nombre del cliente es :" + this._cliente + " -- y el folio del prestamo es :"+this._folio);
    
    this.obtenerPrestamos();
    this.locate();

    //console.log("la hora es :" + this._horaActual);
  }

  locate(){

    Geolocation.getCurrentPosition().then((resp) => {    
      this.lat=resp.coords.latitude.toString();  
      this.lon=resp.coords.longitude.toString();
      console.log("Las coordenadas son: "+this.lat+"/"+this.lon);
    });

  }


  obtenerPrestamos(){

    this.prestamoService.getPrestamosEspecifico(this._folio)
    .subscribe(data => {
      this.lista = data;
      this.prestamoEspecifico = this.lista.prestamo;
      console.log("Este es tu prestamo especifico para registrar tus pagos: ");
      console.log(this.prestamoEspecifico);

      this.buscarCliente();
    })
  }

  buscarCliente(){
    this.clientesServices.getClientesPorNumeroFinanciera(this.prestamoEspecifico.sucursal, this.prestamoEspecifico.numeroCliente)
    .subscribe( data => {
      //console.log(data);
      this.lista4 = data;
      this.clienteEspecifico = this.lista4.clientes;
      //console.log("CLinete:---");
      //console.log(this.clienteEspecifico[0]);
    })
  }

  actualizarCliente(){
    let activos=this.clienteEspecifico[0].numeroACtivos;

    if(this._restante<=0){
      activos=activos-1;
    }
    const cliente: Clientes={
      puntuacion: '0',
      numeroActivos: activos,
    }
    this.clientesServices.PutClienteFinanciera(this.clienteEspecifico[0]._id, cliente).subscribe(data => {
      if(data){
        console.log(data);
      }
    }, (error: any) => {
      console.log(error);
      alert("Problemas al actualizar al cliente, intente mas tarde");
    });
  }

  actualizarPrestamo(){
    let estatusPrestamo = "Activo";
    if(this._restante<=0){
      estatusPrestamo="Finalizado";
    }

    const prestamo: Prestamo = {
      totalRestante:this._restante,
      fechaPago: this._fecha,
      estatus: estatusPrestamo,
      tipoUltiPago: 'Pago',
    }

    console.log(prestamo);
    this.prestamoService.updatePrestamo(this.prestamoEspecifico._id, prestamo).subscribe(data => {
      if(data){
        this.actualizarCliente();
        this.alertaPagoExitoso(this._abono);
      //  this.obtenerPrestamos();
//        console.log(data);
        this.avisoSMS();

      }
    }, (error: any) => {
      console.log(error);
      this.alertaPagoNo();
    })

  }


  registroPago(){
    let totalRestante_ = Number(this.prestamoEspecifico.totalRestante);
    let abono_ = Number(this._abono);
    this._restante = Math.round(totalRestante_ - abono_);
    this.movimiento="Se registro un pago por $"+this._abono + " de "+ this._cliente;

    this.tipo='PAGO';
    
    const pago: Pago = {
      fecha: this._fecha,
      folio: 'PAG'+year+month+day+hour+minutes+secons+mili,
      nombreCliente: this.prestamoEspecifico.nombre,
      numCliente: this.prestamoEspecifico.numeroCliente,
      cobranza: this.prestamoEspecifico.cobranza,
      cantidadPrestamo: this.prestamoEspecifico.cantidadPrestamo,
      plazo: this.prestamoEspecifico.cantidadPrestamo,
      totalPagar: this.prestamoEspecifico.cantidadPagar,
      totalRestante: this._restante,
      pagoDiario: this.prestamoEspecifico.pagoDiario,
      folioPrestamo: this.prestamoEspecifico.folio,
      fechaPago: this._fecha,
      horaPago: this._horaActual,
      gestor: this.prestamoEspecifico.gestor,
      tipo: 'Pago',
      comentario: 'Vacio',
      abono: abono_,
      personasCobrador: 'Gestor',
      sucursal: this.prestamoEspecifico.sucursal,
    }


    console.log("el objeto pago es ");
    console.log(pago);

    this.pagoService.postPago(pago).subscribe(data => {
      
        if(data){
          console.log("Se registro el pago en el registro de pagos");

          this.registrarMovimiento(`Registro de un pago de $${abono_}, correspondiente al cliente : ${this.prestamoEspecifico.nombre}`);
          this.actualizarPrestamo();
        }
    }, (error) => {
      console.log(error);   
    })

  /* this.pruebaSMS();
    window.location.assign(this.urlWhats);*/
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
      sucursal: this.prestamoEspecifico.sucursal,
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


  agregarMora(){
    let totalRestante_ = Number(this.prestamoEspecifico.totalrestante);
    this._restante = String(totalRestante_ + 50);



    const pago1: Pago = {

    }
    this.pagoService.postPago(pago1).subscribe(data => {
      
        if(data){
          console.log(pago1);
          console.log("Se registro la mora exitosamente");      
          this.presentAlert();
        }
    }, (error: any) => {
      console.log(error);   
    })

    this.movimiento='Se registro una mora a '+this._cliente;
    //this.registrarMovimiento();

    this.actualizarPrestamo();

    this.moraSMS();
    window.location.assign(this.urlWhats);
  }

  avisoSMS(){
    let texto="Señor(a) "+this._cliente+" nos comunicamos para informarle que su pago de $"+this._abono + " se realizo con éxito";

    this.WhatsappNumero=this.prestamoEspecifico.telefono;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+this.WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);
    this._abono='0';

    this.router.navigate(['/clientes']);
    window.location.assign(this.urlWhats);
  }

  moraSMS(){
    let texto="Estimado(a) Señor(a) "+this._cliente+" nos comunicamos de Finapoyo para informarle que debido a su falta de pago se agrego una MORA de $50 a su total";

    this.WhatsappNumero=this.prestamoEspecifico.telefono;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+this.WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);
    this._abono='0';

  }

  eliminarAcentos(){
    this.nombreCorregido = this._cliente.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

  



}
