import { Component, OnInit } from '@angular/core';
import { Prestamo } from 'src/app/interfaces/interfaces';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { PagoService } from 'src/app/services/pago.service';
import { SharedService } from 'src/app/services/shared.service';

var today = new Date();

@Component({
  selector: 'app-cobrar-cuentas',
  templateUrl: './cobrar-cuentas.page.html',
  styleUrls: ['./cobrar-cuentas.page.scss'],
})
export class CobrarCuentasPage implements OnInit {

  correoAsesor = this.sharedService.getUsername();
  correo_asesor: string = '';
  numPrestamos: any;
  sucursalFinanciera  = this.sharedService.getFinanciera();

  cuentasxCobrar=0;
  cuentasCobradas=0;


  lista: any = [];
  listaPrestamos: any = [];
  listaPagos: any = [];
  listaPrestamosCobrador: any = [];
  listaCuentasPagadas: any = [];
  pagosEspecificos: any = [];
  
  resultado= [this.listaPrestamos];

  constructor(
    private prestamoService:PrestamoService,
    private sharedService: SharedService,
    private pagoService: PagoService
  ) { }

  ngOnInit() {
    
    this.obtenerPrestamos();

    console.log("Resultado");
    console.log(this.resultado);
   // this.obtenerPagos();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.obtenerPrestamos();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };


  obtenerPrestamos(){
    this.prestamoService.getPrestamosFinanciera(this.sucursalFinanciera)
    .subscribe(data => {
      this.lista = data;
      this.listaPrestamos = this.lista.prestamos;
      console.log(this.listaPrestamos)

      this.seleccionarPrestamos();
    })
  }

  seleccionarPrestamos(){
    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }

    this.listaCuentasPagadas=[];


    let fechaActual = today.getDate()+"-"+(today.getMonth() + 1)+"-"+today.getFullYear();
    this.listaPrestamosCobrador=[];
   // console.log("La fecha actual es : "+fechaActual);

    for (let index = 0; index < this.listaPrestamos.length; index++) {    
      if (this.listaPrestamos[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase()) {

        console.log(this.listaPrestamos[index].fechaPago);
        console.log(fechaActual);

            if (this.listaPrestamos[index].fechaPago==fechaActual) {
              this.listaCuentasPagadas.push(this.listaPrestamos[index]);
            }
            else if (this.listaPrestamos[index].tipoPrestamo=='Diario'||
            (this.listaPrestamos[index].tipoPrestamo=='Semanal' && this.listaPrestamos[index].proximoPago==fechaActual)) {
              this.listaPrestamosCobrador.push(this.listaPrestamos[index]);
            } 
      }        
    }
    console.log(this.listaPrestamosCobrador);
    this.cuentasxCobrar=this.listaPrestamosCobrador.length;
    this.cuentasCobradas=this.listaCuentasPagadas.length;

    this.resultado = this.listaPrestamosCobrador;
  }


  barraBusqueda(event) {

    const query = event.target.value.toString().toLowerCase();

    this.resultado = this.listaPrestamosCobrador.filter(d => d.nombre.toLowerCase().indexOf(query) > -1 || d.colonia.toLowerCase().indexOf(query) > -1);

  }


}
