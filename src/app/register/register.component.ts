import { Component, OnInit } from '@angular/core';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { User } from '../models/User.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../app.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    protected restClientServiceService: RestClientServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
  ) { }

  formData = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    secondName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('user')
  });

  ngOnInit(): void {
  }
  
  onSubmit(form: any) {
    const user: User = {
      firstName: form.value.firstName,
      secondName: form.value.secondName,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password,
      role: 'user' // or any default role you want to assign
    };
  
    const token$ = this.restClientServiceService.register(user).pipe(
      map((response: any) => {
        return response.access_token;
      })
    );

    token$.toPromise().then((token: string) => {
      this._JWTTokenServiceService.setToken(token);
      this.route.navigate(['/shop']);
    });

    // this.restClientServiceService.register(user).subscribe(
    //   (response: any) => {
    //     this._JWTTokenServiceService.setToken(response.access_token);
    //     this.route.navigate(['/shop']);
    //   }
    // );
  }
}