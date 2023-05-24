import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { CartServiceService } from '../services/cart-service.service';
import { from, of } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let tokenServiceSpy: jasmine.SpyObj<JWTTokenServiceService>;
  let cartServiceSpy: jasmine.SpyObj<CartServiceService>;

  beforeEach(async () => {
    const tokenSpy = jasmine.createSpyObj('JWTTokenServiceService', ['setToken']);
    const cartSpy = jasmine.createSpyObj('CartServiceService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [ RegisterComponent ],
      providers: [
        { provide: JWTTokenServiceService, useValue: tokenSpy },
        { provide: CartServiceService, useValue: cartSpy },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
        
      ]
    })
    .compileComponents();

    tokenServiceSpy = TestBed.inject(JWTTokenServiceService) as jasmine.SpyObj<JWTTokenServiceService>;
    cartServiceSpy = TestBed.inject(CartServiceService) as jasmine.SpyObj<CartServiceService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    const formValues = {
      firstName: 'John',
      secondName: 'Doe',
      phone: '123-456-7890',
      email: 'johndoe@example.com',
      password: 'password123',
      role: 'user',
    };

    it('should call the register API and set the token', async () => {
      const token = 'abc123';
      const registerSpy = spyOn(component['restClientServiceService'], 'register').and.returnValue(of({ access_token: token }));

      component.onSubmit({ value: formValues });

      expect(registerSpy).toHaveBeenCalledWith(formValues);
      await fixture.whenStable();
      expect(tokenServiceSpy.setToken).toHaveBeenCalledWith(token);
      expect(cartServiceSpy.openSnackBar).toHaveBeenCalledWith('You successfully registered!');
    });

    it('should display an error message if registration fails', async () => {
      const error = { error: 'Registration failed' };
      const registerSpy = spyOn(component['restClientServiceService'], 'register').and.returnValue(from(Promise.reject(error)));
    
      component.onSubmit({ value: formValues });
    
      expect(registerSpy).toHaveBeenCalledWith(formValues);
      await fixture.whenStable();
      expect(tokenServiceSpy.setToken).not.toHaveBeenCalled();
    });
  });
});
