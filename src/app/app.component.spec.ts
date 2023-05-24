import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { JWTTokenServiceService } from './services/jwttoken-service.service';
import { CartServiceService } from './services/cart-service.service';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let jwtTokenService: JWTTokenServiceService;
  let cartService: CartServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        HttpClientTestingModule,
        MatSnackBarModule 
      ],
      declarations: [AppComponent],
      providers: [
        JWTTokenServiceService,
        CartServiceService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    jwtTokenService = fixture.debugElement.injector.get(JWTTokenServiceService); // Use fixture.debugElement.injector.get()
    cartService = fixture.debugElement.injector.get(CartServiceService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component.title).toEqual('pharmacy-website');
    expect(component.isTokenExpired$).toEqual(jasmine.any(BehaviorSubject));
    expect(component.numOfCartItems).toEqual(0);
    expect(component.toggleNavbar).toBeTrue();
  });

  it('should call the necessary methods on logout', () => {
    spyOn(jwtTokenService, 'logout');
    component.logout();
    expect(jwtTokenService.logout).toHaveBeenCalled();
  });
});
