import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse, Clientes } from '../interfaces/interfaces';
import { Observable } from 'rxjs/internal/Observable';

const URL = environment.url+"/api/interes";

@Injectable({
  providedIn: 'root'
})
export class InteresService {

  constructor(private http: HttpClient) { }

  getInteresFinanciera(id:any)
  {
    return this.http.get(`${URL}/${id}`);
  }

}
