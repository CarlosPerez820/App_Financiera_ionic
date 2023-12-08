import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { PagoService } from 'src/app/services/pago.service';
import { AlertController } from '@ionic/angular';
import { Prestamo, Pago } from 'src/app/interfaces/interfaces';
import { Console } from 'console';
import { strict } from 'assert';
//import { SMS } from "@awesome-cordova-plugins/sms/ngx";

var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();

// muestra la fecha de hoy en formato `MM/DD/YYYY`
var fechaDia = `${day}-${month}-${year}`;




@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage implements OnInit {

 // _horaActual = hour;

  _cliente: any;
  _urlIMG: any;
  WhatsappNumero: any;
  urlWhats: string='';

  _nombre: string='';
  nombre: string='';
  _fecha: string = fechaDia;
  _abono: string = '0';
  _restante: string ='';

  listaPrestamos:any = [];
  prestamoEspecifico:any = [];
  prestamosCliente:any = [];

  constructor(
    private clientesServices:ClientesService,
    private prestamoService:PrestamoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private pagoService: PagoService
    //private sms: SMS
  ) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'AÑADIR MORA',
      message: 'Esta accion aumentara $50 a su monto original',
      buttons: ['OK' ,'CANCELAR']
    });

    await alert.present();
  }

  async alertaPagoExitoso(cantidad: string) {
    const alert = await this.alertController.create({
      header: 'ACTUALIZACION REALIZADA',
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
    console.log("El nombre es: "+this._cliente);
    this._urlIMG = this.activatedRoute.snapshot.paramMap.get("img");

    
    this.obtenerPrestamos();

    
    console.log(today.getHours()+":"+today.getMinutes());
  }

  obtenerPrestamos(){
    this.prestamoService.getPrestamos()
    .subscribe( data => {
      console.log( data );
      this.listaPrestamos = data;

      //this.buscarprestamo();
      this.buscarPrestamosCliente();
    })
  }

  buscarprestamo(folio){

    for (let index = 0; index < this.prestamosCliente.length; index++) {
      
      //  console.log(this.listaPrestamos[index].nombre);
        if (this.prestamosCliente[index].folio==folio) {
            this.prestamoEspecifico=this.prestamosCliente[index];      
        }
    }
    //console.log(this.prestamoEspecifico);

  }

  buscarPrestamosCliente(){
    for (let index = 0; index < this.listaPrestamos.length; index++) {
      
      //  console.log(this.listaPrestamos[index].nombre);
        if (this.listaPrestamos[index].nombre==this._cliente) {
          this.prestamosCliente.push(this.listaPrestamos[index]);
        }
    }
  }


  actualizarPrestamo(){
    const prestamo: Prestamo = {
      /*fecha: this.prestamoEspecifico.fechapago,
      folio: this.prestamoEspecifico.folio,
      nombre: this.prestamoEspecifico.nombre,
      direccion: this.prestamoEspecifico.direccion,
      colonia: this.prestamoEspecifico.colonia,
      telefono: this.prestamoEspecifico.telefono,
      cobranza: this.prestamoEspecifico.cobranza,
      cantidadprestamo: this.prestamoEspecifico.cantidadprestamo,
      plazoprestamo: this.prestamoEspecifico.plazoprestamo,
      totalapagar: this.prestamoEspecifico.totalapagar,
      totalrestante: this._restante,
      pagodiario: this.prestamoEspecifico.pagodiario,
      fechapago: this._fecha,
      gestor: this.prestamoEspecifico.gestor,
      estatus: this.prestamoEspecifico.estatus,
      urldinero: "./public/fotosprestamos/",
      urlpagare: "./public/fotosprestamos/",
      urlfachada: "./public/fotosprestamos/"
*/
    }

    console.log(prestamo);
    //console.log("El ID del prestamo es: " + this.prestamoEspecifico._id);
    this.prestamoService.updatePrestamo(this.prestamoEspecifico._id, prestamo).subscribe(data => {
      if(data){
        this.alertaPagoExitoso(this._abono);
        this.obtenerPrestamos();
        
      }
     // this.router.navigate(['/prestamos']);
    }, (error: any) => {
      console.log(error);
      this.alertaPagoNo();
    })
    //this._abono='0';
  }

  registroPago(){
    //console.log("ERA: "+this.prestamoEspecifico.totalrestante);
    //console.log("PAGO: "+this._abono);
    let totalRestante_ = Number(this.prestamoEspecifico.totalrestante);
    let abono_ = Number(this._abono);
    //console.log(totalRestante_ - abono_);
    this._restante = String(Math.round(totalRestante_ - abono_));

    const pago: Pago = {
      /*fecha: this._fecha,
      folio: this.prestamoEspecifico.folio,
      nombre: this.prestamoEspecifico.nombre,
      direccion: this.prestamoEspecifico.direccion,
      colonia: this.prestamoEspecifico.colonia,
      telefono: this.prestamoEspecifico.telefono,
      cobranza: this.prestamoEspecifico.cobranza,
      cantidadprestamo: this.prestamoEspecifico.cantidadprestamo,
      plazoprestamo: this.prestamoEspecifico.plazoprestamo,
      totalapagar: this.prestamoEspecifico.totalapagar,
      totalrestante: this._restante,
      pagodiario: this.prestamoEspecifico.pagodiario,
      fechapago: this._fecha,
      gestor: this.prestamoEspecifico.gestor,
      estatus: this.prestamoEspecifico.estatus,
      urldinero: "./public/fotosprestamos/",
      urlpagare: "./public/fotosprestamos/",
      urlfachada: "./public/fotosprestamos/",
      abono: this._abono  */
    }

    this.pagoService.postPago(pago).subscribe(data => {
        if(data){
          console.log("Se registro el pago en el registro de pagos");
          console.log(data);
        }
    }, (error: any) => {
      console.log(error);
      
    })

    //console.log("PAGO");
    //console.log(pago);

    this.actualizarPrestamo(); 
    this.pruebaSMS();
    window.location.assign(this.urlWhats);
  
  }

  agregarMora(){
    let totalRestante_ = Number(this.prestamoEspecifico.totalrestante);
    this._restante = String(totalRestante_ + 50);
    this.actualizarPrestamo();

    this.moraSMS();
    window.location.assign(this.urlWhats);
    //console.log("Mora de $50");
  }


  pruebaSMS(){
    let texto="Señor(a) "+this._cliente+" nos comunicamos de Finapoyo para informarle que su pago de $"+this._abono + " se realizo con éxito";

    this.WhatsappNumero=this.prestamoEspecifico.telefono;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+this.WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);
   // this.sms.send('2431291260', 'Hello world!');
   //whatsapp://send?phone=numero_telefónico?text=Mensaje_enviar_por_defecto"
   this._abono='0';

  }

  
  moraSMS(){
    let texto="Estimado(a) Señor(a) "+this._cliente+" nos comunicamos de Finapoyo para informarle que debido a su falta de pago se agrego una MORA de $50 a su total";

    this.WhatsappNumero=this.prestamoEspecifico.telefono;
    let codigoPais: string ="52";
    this.urlWhats= "https://wa.me/"+ codigoPais+this.WhatsappNumero+"?text="+texto;
  
    console.log("SMS....................." + this.urlWhats);
   // this.sms.send('2431291260', 'Hello world!');
   //whatsapp://send?phone=numero_telefónico?text=Mensaje_enviar_por_defecto"
   this._abono='0';

  }


}
