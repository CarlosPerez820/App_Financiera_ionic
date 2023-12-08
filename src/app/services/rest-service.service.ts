import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  constructor(private http: HttpClient) { }

  sendPost(body:FormData){
    const headers = new HttpHeaders()

    return this.http.post(`${ URL }/upload`, body, { headers });
  }

}
