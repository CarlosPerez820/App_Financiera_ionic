import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {

  correoAsesor = localStorage.getItem("token");

  correo_asesor: string = '';

  listaSolicitudes:any = [];
  listaSolicitudesCobrador:any = [];
  resultado= [this.listaSolicitudes];

  constructor(private solicitudesService: SolicitudesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
   // this.correoAsesor = this.activatedRoute.snapshot.paramMap.get("correo");
    console.log(this.correoAsesor);
    this.obtenerSolicitudes();
  }

  seleccionarSolicitudes(){
    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }
    this.listaSolicitudesCobrador=[];
    for (let index = 0; index < this.listaSolicitudes.length; index++) {
      if (this.listaSolicitudes[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase() && this.listaSolicitudes[index].estatus!="FINALIZADA") {
        //this.pagosEspecificos=this.listaPagos[index];
      
         this.listaSolicitudesCobrador.push(this.listaSolicitudes[index]);
        
      }
  }
  console.log(this.listaSolicitudesCobrador);
  this.resultado = this.listaSolicitudesCobrador;
  }


  obtenerSolicitudes(){
    this.solicitudesService.getSolicitudes()
    .subscribe( data => {
     // console.log( data );
      this.listaSolicitudes = data;
      console.log(this.listaSolicitudes);
      //this.resultado = this.listaSolicitudes;

      this.seleccionarSolicitudes();
    })
  }


  barraBusqueda(event) {

    const query = event.target.value.toString().toLowerCase();

    this.resultado = this.listaSolicitudesCobrador.filter(d => d.nombre.toLowerCase().indexOf(query) > -1|| d.estatus.toLowerCase().indexOf(query) > -1);

  }


  handleRefresh(event: any) {
    setTimeout(() => {
      this.obtenerSolicitudes();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };

}
