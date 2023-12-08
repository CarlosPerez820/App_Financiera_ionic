import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import jwtDecode from 'jwt-decode'
import { NavController } from '@ionic/angular';
//import { AuthResponse, Usuario } from '../interfaces/interfaces';

const URL = environment.url+'/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  element = false;
  email:any;
  password:any;

  constructor(private router: Router, 
    private alertController: AlertController,
    private authService: AuthService,
    private navCtrl: NavController,
    private http: HttpClient) { }



  ngOnInit() {

    if(localStorage.getItem("token")!=""){
     // this.email = localStorage.getItem("token");

    }
  }

  login(){
    // this.alertAccesoFallido();
  //  console.log("Login");
    const _email=this.email;
    const pass = this.password;

    this.authService.login(_email, pass)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.alertAccesoFallido();
            console.error('Error HTTP 400:', error.error);

          } else {
            console.error('Error:', error);
          }
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            this.irDashboard();
          }

          this.accederInfo();
        

      },
      (error) => {
        // Este bloque se ejecutará solo si no se maneja el error en el operador catchError.
        // Puedes realizar acciones adicionales para manejar el error aquí.
      });
  }

  async alertAccesoFallido() {
    const alert = await this.alertController.create({
      header: 'ACCESO FALLIDO',
      message: 'EL usuario o contraseña son errones, por favor verifica',
      buttons: ['OK']
    });

    await alert.present();
  }

  accederInfo(){
    console.log(this.authService.getToken());

    const token = this.authService.getToken();

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken); // Aquí tendrás acceso a la información del payload
    } else {
      console.log("No existe JWT");
    }
  }

  irDashboard(){
    this.navCtrl.navigateForward('/dashboard', { animated: false, replaceUrl: true });
  }

}

