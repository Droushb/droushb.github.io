import { Component, OnInit } from '@angular/core';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { Router } from '@angular/router';
import { map, from } from 'rxjs';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../app.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    protected restClientServiceService: RestClientServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _cartServiceService: CartServiceService,
  ) { }

  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
  }

  onSubmit(data: any) {
    const email = data.value.email;
    const password = data.value.password;

    const token$ = from(this.restClientServiceService.login(email, password)).pipe(
      map((response: any) => {
        return response.access_token;
      })
    );

    token$.toPromise().then((token: string) => {
      this._JWTTokenServiceService.setToken(token);
      // this.isTokenExpired$.next(false);
      this._cartServiceService.openSnackBar("You successfully logged in!");
      this.route.navigate(['/shop']);
    }).catch((error: any) => {
      this._cartServiceService.openSnackBar("Error: " + error.error);
    });
  }

}