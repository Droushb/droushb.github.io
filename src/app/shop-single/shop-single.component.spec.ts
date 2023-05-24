import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ShopSingleComponent } from './shop-single.component';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { DrugDetails } from '../models/DrugDetails.model';
import { CartServiceService } from '../services/cart-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ShopSingleComponent', () => {
  let component: ShopSingleComponent;
  let fixture: ComponentFixture<ShopSingleComponent>;
  let activatedRoute: ActivatedRoute;
  let restClientServiceService: RestClientServiceService;
  let cartServiceService: CartServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule // add MatSnackBarModule to imports
      ],
      declarations: [ShopSingleComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ drugId: '1' }),
          },
        },
        RestClientServiceService,
        CartServiceService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSingleComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    restClientServiceService = TestBed.inject(RestClientServiceService);
    cartServiceService = TestBed.inject(CartServiceService);
    spyOn(restClientServiceService, 'getDrugDetails').and.returnValue(of({}));
    spyOn(cartServiceService, 'openSnackBar');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call RestClientServiceService.getDrugDetails on init', () => {
    component.ngOnInit();
    expect(restClientServiceService.getDrugDetails).toHaveBeenCalled();
  });

  it('should call CartServiceService.addToCart on addToCartFromShop', () => {
    spyOn(cartServiceService, 'addToCart');
    component.addToCartFromShop(1, '2');
    expect(cartServiceService.addToCart).toHaveBeenCalledWith(1, 2);
  });
});
