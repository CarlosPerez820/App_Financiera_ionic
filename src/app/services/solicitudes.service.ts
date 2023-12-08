import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Solicitudes } from '../interfaces/interfaces';
import { AnyARecord } from 'dns';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private http: HttpClient) { }

  //No se utiliza
  getSolicitudes()
  {
    return this.http.get(`${ URL }/api/solicitudes/`);
  }


  //Se utilizan 
  getSolicitudEspecifica(id: string)
  {
    return this.http.get(`${ URL }/api/solicitudes/${id}`);
  }

  getSolicitudesFinanciera(financiera: any)
  {
    return this.http.get(`${ URL }/api/solicitudes/validos/${financiera}`);
  }

  getSolicitudesFinancieraDia(financiera: any, dia:any)
  {
    return this.http.get(`${ URL }/api/solicitudes/${financiera}/${dia}`);
  }

//Nueva version para guardar
  guardarSolicitud(solicitud: Solicitudes){

    return this.http.post(`${ URL }/api/solicitudes/`, solicitud);
  }


  updateSolicitud(id: any, data: any) {
    return this.http.put(`${ URL }/api/solicitudes/${id}`, data);
  }


}
