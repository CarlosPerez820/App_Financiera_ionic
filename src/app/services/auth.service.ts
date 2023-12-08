import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Usuario, AuthResponse } from '../interfaces/interfaces';
import { url } from 'inspector';

const url_api = environment.url+'/api';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _usuario!: Usuario;
  public currentUser = null;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient) { }

  login(correo: string, password: string): Observable<any> {
    const body = {
      usuario: correo,
      password: password,
    };

    return this.http.post(`${url_api}/auth/movil`, body);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

}
