import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

const URL = environment.url+"/api/uploads";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }


  uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    console.log(formData);
    console.log(file);

    return this.http
      .post(`${ URL }/ruta/subruta/prueba`,formData)
      .toPromise();
  }

  
  uploadUpdateFile(file: File,id: any, coleccion: string, ruta:string, subruta:string, nombre:string, opcion:string): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    console.log(formData);
    console.log(file);

    return this.http
      .put(`${ URL }/${id}/${coleccion}/${ruta}/${subruta}/${nombre}/${opcion}`,formData)
      .toPromise();
  }


}
