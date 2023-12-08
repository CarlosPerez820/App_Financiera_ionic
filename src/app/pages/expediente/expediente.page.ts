import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.page.html',
  styleUrls: ['./expediente.page.scss'],
})
export class ExpedientePage implements OnInit {

  _numeroCliente:string='';
  _imgFrente: any;
  _imgReverso: any;
  _imgComprobante: any;
  urlServidor:string='https://node-restserver-financiera-production.up.railway.app/';
  sucursalFinanciera = this.sharedService.getFinanciera();
  lista:any;
  listaCliente:any=[];
  clienteEspecifico:any=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private clienteServices: ClientesService
  ) { }

  ngOnInit() {
    this._numeroCliente = this.activatedRoute.snapshot.paramMap.get("id")??'';
    console.log(this._numeroCliente);
    this.obtenerCliente();
  }

  obtenerCliente(){
    this.clienteServices.getClientesPorNumeroFinanciera(this.sucursalFinanciera, this._numeroCliente)
    .subscribe( data => {
      this.lista = data;
      this.listaCliente = this.lista.clientes;
      this.clienteEspecifico = this.listaCliente[0];
      console.log(this.clienteEspecifico);

    })
  }

}
