import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CartServiceService } from '../services/cart-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let jwtTokenService: JWTTokenServiceService;
  let cartService: CartServiceService;
  let restClientServiceService: RestClientServiceService;
  let route: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MatSnackBarModule ],
      providers: [ JWTTokenServiceService, CartServiceService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    jwtTokenService = TestBed.inject(JWTTokenServiceService);
    cartService = TestBed.inject(CartServiceService);
    route = TestBed.inject(Router);
    restClientServiceService = TestBed.inject(RestClientServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call restClientServiceService.login method on form submission', () => {
  //   spyOn(restClientServiceService, 'login').and.callThrough();
  //   component.onSubmit(component.formData);
  //   expect(restClientServiceService.login).toHaveBeenCalled();
  // });

  // it('should set the token in the JWTTokenServiceService on successful login', (done: DoneFn) => {
  //   spyOn(restClientServiceService, 'login').and.returnValue(from(Promise.resolve({ access_token: 'test_token' })));
  //   spyOn(jwtTokenService, 'setToken').and.callThrough();
  //   spyOn(cartService, 'openSnackBar').and.callThrough();
  //   spyOn(route, 'navigate').and.callThrough();
  //   component.onSubmit(component.formData);

  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(jwtTokenService.setToken).toHaveBeenCalledWith('test_token');
  //     expect(cartService.openSnackBar).toHaveBeenCalledWith('You successfully logged in!');
  //     expect(route.navigate).toHaveBeenCalledWith(['/shop']);
  //     done();
  //   });
  // });

  // it('should show error message in snackbar on failed login', async (done: DoneFn) => {
  //   spyOn(restClientServiceService, 'login').and.returnValue(await Promise.reject({ error: 'Invalid credentials' }));
  //   spyOn(cartService, 'openSnackBar').and.callThrough();
  //   component.onSubmit(component.formData);

  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(cartService.openSnackBar).toHaveBeenCalledWith('Error: Invalid credentials');
  //     done();
  //   });
  // });
});
