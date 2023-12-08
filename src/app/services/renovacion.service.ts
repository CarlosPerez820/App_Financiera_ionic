import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Renovaciones } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RenovacionService {

  constructor(private http: HttpClient) { }

  getRenovaciones()
  {
    return this.http.get(`${ URL }/api/renovaciones/`);
  }

  getRenovacionEspecifica(id: string)
  {
    return this.http.get(`${ URL }/api/renovaciones/${id}`);
  }

  guardarRenovacion(renovacion: Renovaciones){
    const headers = new HttpHeaders()

    return this.http.post(`${ URL }/api/renovaciones/`, renovacion, { headers });
  }

  updateRenovacion(id: any, data: any) {
    return this.http.put(`${ URL }/api/renovaciones/${id}`, data);
  }

}
