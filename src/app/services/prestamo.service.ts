import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Prestamo } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(private http: HttpClient) { }

  //Funciona pero no se usa
  getPrestamos()
  {
    return this.http.get(`${ URL }/api/prestamos/`);
  }

  //Funciona Prestamos de cliente
  getPrestamosFinanciera(financiera:any)
  {
    return this.http.get(`${ URL }/api/prestamos/validos/${financiera}`);
  }

  //Funciona Prestamo sepecifico
  getPrestamosEspecifico(id:any)
  {
    return this.http.get(`${ URL }/api/prestamos/especifico/${id}`);
  }

  //Funciona Prestamos de cliente
  getPrestamosCliente(financiera:any, cliente:any)
  {
    return this.http.get(`${ URL }/api/prestamos/${financiera}/${cliente}`);
  }

  guardarPrestamo(prestamo: Prestamo){
    const headers = new HttpHeaders()

    return this.http.post(`${ URL }/api/prestamos/`, prestamo, { headers });
  }

  updatePrestamo(id: any, data: any) {
    return this.http.put(`${ URL }/api/prestamos/${id}`, data);
  }

}
