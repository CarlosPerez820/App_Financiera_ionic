import { Component, OnInit } from '@angular/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { ActionSheetController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Prestamo } from 'src/app/interfaces/interfaces';
import { PrestamoService } from 'src/app/services/prestamo.service';
import { SharedService } from 'src/app/services/shared.service';

interface Componente{
  icon: string;
  name: string;
  redirectTo: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],

})

export class ClientesPage implements OnInit {

  componentes: Componente[]=[
    {icon: 'person-circle-outline',
    name: 'CLIENTE 1',
  redirectTo: '/editar-pagos'

    }
  ];

  correoAsesor = this.sharedService.getUsername();
  sucursalFinanciera = this.sharedService.getFinanciera();

  correo_asesor: string = '';

  numClientes: any;

  lista: any = [];
  listaClientes:any = [];
  listaClientesCobrador: any = [];

  resultado= [this.listaClientes];

  listaPrestamos: any = [];


  constructor( private clientesServices:ClientesService ,
    private actionSheetCtrl: ActionSheetController, 
    private prestamoService:PrestamoService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService) { }

  ngOnInit() {

    console.log(this.correoAsesor);
    this.obtenerClientes();
    this.obtenerPrestamos();

  }

  obtenerClientes(){
    this.clientesServices.getClientesFinanciera(this.sucursalFinanciera)
    .subscribe( data => {
      this.lista = data;
      this.listaClientes = this.lista.clientes;
      console.log(this.listaClientes);
      this.seleccionarClientes();
    })
  }

  obtenerPrestamos(){
    this.prestamoService.getPrestamos()
    .subscribe( data => {
      console.log( data );
      this.listaPrestamos = data;

      //this.buscarprestamo();
    })
  }

  seleccionarClientes(){

    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }

    this.listaClientesCobrador=[];
    for (let index = 0; index < this.listaClientes.length; index++) {
     if (this.listaClientes[index].gestorAsignado.toUpperCase()==this.correo_asesor.toUpperCase()) {
        this.listaClientesCobrador.push(this.listaClientes[index]);
        
     }
     this.numClientes = this.listaClientesCobrador.length;
     
    }
  
    console.log(this.listaClientesCobrador);

    this.resultado = this.listaClientesCobrador;
  }


onClick(){
this.presentActionSheet();
}

handleRefresh(event: any) {
  setTimeout(() => {
    this.obtenerClientes();
    // Any calls to load data go here
    event.target.complete();
  }, 2000);
};

async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      backdropDismiss: false,
      buttons: [{
        text: 'PAGOS',
        role: 'destructive',
        icon: 'calculator-outline',
        handler: () => {

          console.log();
        }

      }, {
        text: 'RENOVACIONES',
        icon: 'clipboard-outline',

      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',

        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  barraBusqueda(event) {
    
    const query = event.target.value.toString().toLowerCase();
    
    this.resultado = this.listaClientesCobrador.filter(d => d.nombre.toLowerCase().indexOf(query) > -1);
  }



  }


