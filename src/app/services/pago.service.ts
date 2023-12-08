import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Pago } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient) { }

  //Funciona pero no se utiliza
  getPagos()
  {
    return this.http.get(`${ URL }/api/pagos/`);
  }

  //Funciona y se utiliza
  getPagosFinanciera(financiera:any, fecha:any)
  {
    return this.http.get(`${ URL }/api/pagos/${financiera}/${fecha}`);
  }

  //Funciona y se utiliza
  getPagosPrestamo(financiera:any, folio:any)
  {
    return this.http.get(`${ URL }/api/pagos/prestamo/${financiera}/${folio}`);
  }


  //Funciona y se utiliza
  postPago(pago: Pago){

    return this.http.post(`${ URL }/api/pagos/`, pago);
  }

}
