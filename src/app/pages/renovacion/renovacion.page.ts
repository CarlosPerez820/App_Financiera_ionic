import { Component, OnInit } from '@angular/core';
import { RenovacionService } from 'src/app/services/renovacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.page.html',
  styleUrls: ['./renovacion.page.scss'],
})
export class RenovacionPage implements OnInit {

  correoAsesor = localStorage.getItem("token");

  correo_asesor: string = '';

  listaRenovaciones:any = [];
  listaRenovacionesCobraddor:any = [];

  listaRenovacionesAprobadas:any = [];

  aprobadas:boolean=false;
  pendientes:boolean=false;
  todasRenovaciones:boolean=false;

  resultado= [this.listaRenovaciones];

  /*oculta */


  todas(){
   /* this.aprobadas=true;
    this.pendientes=true;*/
    this.todasRenovaciones=true;
    this.aprobadas=false;
    this.pendientes=false
    console.log("Todas");
  }

  soloP(){
    /*this.pendientes1=!this.pendientes1;
    this.aprobadas=!this.aprobadas;*/
    this.aprobadas = false;
    this.pendientes = true;
    this.todasRenovaciones=false;
    console.log("Pendientes");
  }

  soloA(){
    this.pendientes = false;
    this.aprobadas = true;
    this.todasRenovaciones=false;
    console.log("Aprobadas");
    /*this.pendientes=!this.pendientes;
    this.aprobadas1=!this.aprobadas1;*/
  }

  constructor(private renovacionService:RenovacionService, private activatedRoute: ActivatedRoute) { }

onClick(){}


  ngOnInit() {
    //this.correoAsesor = this.activatedRoute.snapshot.paramMap.get("correo");
    console.log(this.correoAsesor);
    this.obtenerRenovaciones();
    this.todas();
   // this.resultado = this.listaRenovaciones;
  }

  seleccionarRenovaciones(){

    if(this.correoAsesor!=null){
      this.correo_asesor=this.correoAsesor;     
    }


    this.listaRenovacionesCobraddor=[];
    for (let index = 0; index < this.listaRenovaciones.length; index++) {
      
      if (this.listaRenovaciones[index].gestor.toUpperCase()==this.correo_asesor.toUpperCase()) {
        //this.pagosEspecificos=this.listaPagos[index];
        if(this.listaRenovaciones[index].estatus!="FINALIZADA"){

          this.listaRenovacionesCobraddor.push(this.listaRenovaciones[index]);

        }
       
      }


  }
  

  console.log(this.listaRenovacionesCobraddor);

  this.resultado = this.listaRenovacionesCobraddor;
  }

  obtenerRenovaciones(){
    this.renovacionService.getRenovaciones()
    .subscribe( data => {
     // console.log( data );
      this.listaRenovaciones = data;
      console.log(this.listaRenovaciones);
      //this.resultado = this.listaRenovaciones;

      this.seleccionarRenovaciones();
    })
  }

  barraBusqueda(event) {


    const query = event.target.value.toString().toLowerCase();

    this.resultado = this.listaRenovacionesCobraddor.filter(d => d.nombre.toLowerCase().indexOf(query) > -1);

   /* const text = event.target.value;
    this.resultado = this.listaRenovaciones;
    if(text && text.trim() !=''){
      this.resultado = this.resultado.filter((renovacion: any)=>{
        console.log(renovacion.nombre + "---- "+text);
        return (renovacion.nombre.toLowerCase().indexOf(text.toLowerCase() > 1));
        
      })
    }*/

   // console.log(this.resultado);

  }


  handleRefresh(event: any) {
    setTimeout(() => {
      this.obtenerRenovaciones();
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };


}
