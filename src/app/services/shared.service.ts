import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public username: string | undefined;
  public nombre: string | undefined;
  public financiera: string | undefined;
  public _idGestor: string | undefined;

  constructor() {}

  setUsername(user: string) {
    this.username = user;
  }

  getUsername() {
    return this.username;
  }

  setNombre(name: string) {
    this.nombre = name;
  }

  getNombre() {
    return this.nombre;
  }

  setFinanciera(financiera_: string) {
    this.financiera = financiera_;
  }

  getFinanciera() {
    return this.financiera;
  }

  setId(_id: string) {
    this._idGestor = _id;
  }

  getId() {
    return this._idGestor;
  }

}
