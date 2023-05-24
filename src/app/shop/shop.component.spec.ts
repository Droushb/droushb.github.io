import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CartServiceService } from '../services/cart-service.service';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { ShopComponent } from './shop.component';

describe('AllproductsComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let _restClientServiceService: RestClientServiceService;
  let cartService: CartServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatSnackBarModule ],
      declarations: [ ShopComponent ],
      providers: [ CartServiceService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    _restClientServiceService = TestBed.inject(RestClientServiceService);
    cartService = TestBed.inject(CartServiceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    const mockProducts = [
      { DrugId: 1, Name: 'Drug 1', Price: 10, Quantity: 1, Total: 10 },
      { DrugId: 2, Name: 'Drug 2', Price: 20, Quantity: 2, Total: 40 }
    ];
    spyOn(_restClientServiceService, 'getDrugs').and.returnValue(of(mockProducts));
  
    component.ngOnInit();
  
    expect(_restClientServiceService.getDrugs).toHaveBeenCalled();
    expect(component.drugList).toEqual(mockProducts);
  });

   it('should call addToCart method on cart service when addToCartFromShop is called', () => {
    const itemId = 1;
    spyOn(cartService, 'addToCart');

    component.addToCartFromShop(itemId);

    expect(cartService.addToCart).toHaveBeenCalledWith(itemId, 1);
  });
});