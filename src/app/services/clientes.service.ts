import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse, Clientes } from '../interfaces/interfaces';
import { Observable } from 'rxjs/internal/Observable';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  //Get general - Funciona pero no se utiliza
  getCliente()
  {
    return this.http.get(`${ URL }/api/clientes/`);
  }

  //Get Financiera - Funciona
  getClientesFinanciera(financiera:any)
  {
    return this.http.get(`${ URL }/api/clientes/${financiera}`);
  }

  //Get Especifico  - Funciona
  getClienteEspecifico(id: string)
  {
    return this.http.get(`${ URL }/api/clientes/especifico/${id}`);
  }

  //Get Financiera con Numero de Cliente- Funciona
  getClientesPorNumeroFinanciera(financiera:any, nCliente:any)
  {
    return this.http.get(`${URL}/api/clientes/numero/${financiera}/${nCliente}`);
  }

  PutClienteFinanciera(id:any, data:any)
  {
    return this.http.put(`${ URL }/api/clientes/${id}`, data);
  }

  //Post Cliente Funciona
  guardarCliente(cliente: Clientes): Observable<ApiResponse> {

    return this.http.post<ApiResponse>(`${ URL }/api/clientes/`, cliente);
  }

}
