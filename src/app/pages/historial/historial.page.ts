import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from 'src/app/services/pago.service';
import { Pago } from 'src/app/interfaces/interfaces';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  _numero: any;
  _cliente: any;
  _urlIMG: any;
  listaPagos:any = [];
  lista2:any=[];
  lista:any =[];
  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera  = this.sharedService.getFinanciera();
  _folioDado:string='a';

  pagosEspecificos: any = [];
  prestamosEspecificos: any = [];

  _montoPrestado: any;
  _montoaPagar: any;
  _plazoPrestamos: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagoService: PagoService,
    private prestamoService: PrestamoService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this._cliente = this.activatedRoute.snapshot.paramMap.get("nombre");
    this._urlIMG = this.activatedRoute.snapshot.paramMap.get("img");
    this._numero  = this.activatedRoute.snapshot.paramMap.get("numero");
    console.log("El numero del cliente es "+this._numero);

    this.obtenerPagos();
    this.obtenerPrestamosCliente();
  }

  listarPagos(){
    //console.log("Aqui se listaran todos los pagos");
  }


  obtenerPagos(){
    /**this.pagoService.getPagos()
    .subscribe( data => {
      this.lista2 = data;
      this.listaPagos= this.lista2.pago;
      console.log(this.listaPagos);
    })*/
  }

  obtenerPrestamosCliente(){
  //  console.log("EL  nombre de la financiera es "+this.sucursalFinanciera)
    this.prestamoService.getPrestamosCliente(this.sucursalFinanciera, this._numero)
    .subscribe(data => {
      this.lista = data;
      this.prestamosEspecificos = this.lista.prestamos
      //console.log(this.lista);
      //console.log(this.prestamosEspecificos);
    })
  }  


  buscarPagos(folio){
    if(this._folioDado!==folio){
      this._folioDado=folio;

      this.listaPagos=[];

      this.pagoService.getPagosPrestamo(this.sucursalFinanciera, folio)
      .subscribe(data => {
        this.lista2 = data;
        this.listaPagos= this.lista2.pagos;
        console.log(this.listaPagos);
        //console.log(this.lista);
        //console.log(this.prestamosEspecificos);
      })
    }
    /*
    this.pagosEspecificos=[];
      for (let index = 0; index < this.listaPagos.length; index++) {
        if (this.listaPagos[index].folio==folio && this.listaPagos[index].nombre==this._cliente){
         console.log(this.listaPagos[index]);
          this.pagosEspecificos.push(this.listaPagos[index]);
          this._montoPrestado=this.listaPagos[index].cantidadprestamo;
          this._montoaPagar=this.listaPagos[index].totalapagar;
          this._plazoPrestamos=this.listaPagos[index].plazoprestamo;
        }
    }
    console.log("Pagos Especificos");
        console.log(this.pagosEspecificos);
    */
  }


}
