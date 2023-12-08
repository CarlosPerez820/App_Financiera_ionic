import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Prestamo, Actividad, Seguimiento } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RegistroActividadService {

  constructor(private http: HttpClient) { }


  guardarRegistro(actividad: Actividad){
    const headers = new HttpHeaders()
    
    return this.http.post(`${ URL }/api/actividad/`, actividad, { headers });
  }

  //Funciona y se utiliza
  postRegistro(seguimiento: Seguimiento){

    return this.http.post(`${URL}/api/seguimientos/`, seguimiento);
  }

  getActividad()
  {
    return this.http.get(`${ URL }/api/actividad/`);
  }

}
