import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartComponent } from './cart.component';
import { CartServiceService } from '../services/cart-service.service';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Cart } from '../models/Cart.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartServiceService>;
  let dataSource: MatTableDataSource<any>;
  let debugElement: DebugElement;
  let removeButton: DebugElement;
  let updateQuantityInput: DebugElement;
  let makeOrderButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [MatSnackBarModule, BrowserAnimationsModule, HttpClientModule, MatTableModule],
      providers: [
        RestClientServiceService,
        JWTTokenServiceService,
        CartServiceService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartServiceService) as jasmine.SpyObj<CartServiceService>;
    dataSource = new MatTableDataSource<any>();
    dataSource.data = [{ DrugId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }];
    component.dataSource = dataSource;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    removeButton = debugElement.query(By.css('.remove-button'));
    updateQuantityInput = debugElement.query(By.css('.quantity-input'));
    makeOrderButton = debugElement.query(By.css('.make-order-button'));
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the table data source with the cart items', () => {
    const cartItems = [{ DrugId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }] as Cart[];
    spyOn(cartService, 'getCartItems').and.returnValue(cartItems);

    component.ngOnInit();

    expect(component.dataSource.data).toEqual(cartItems);
  });



  it('should remove an item from the cart', () => {
    const itemId = 1;
    spyOn(cartService, 'removeCartItemById');
    spyOn(cartService, 'getCartItems').and.returnValue([{ DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);

    component.removeFromCart(itemId);

    expect(cartService.removeCartItemById).toHaveBeenCalledWith(itemId);
    expect(component.dataSource.data).toEqual([{ DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);
  });

  it('should update the quantity of an item in the cart', () => {
    const itemId = 1;
    const event = { target: { value: 3 } };
    spyOn(cartService, 'updateCartItemById');
    spyOn(cartService, 'getCartItems').and.returnValue([{ DrugId: 1, Name: 'Item 1', Price: 10, Quantity: 3, Total: 30 }, { DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);

    component.updateQuantity(itemId, event);

    expect(cartService.updateCartItemById).toHaveBeenCalledWith(itemId, event.target.value);
    expect(component.dataSource.data).toEqual([{ DrugId: 1, Name: 'Item 1', Price: 10, Quantity: 3, Total: 30 }, { DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }]);
  });

  it('should call makeOrder method of cart service and update data source', () => {
    const cartItems = [{ DrugId: 1, Name: 'Item 1', Price: 10, Quantity: 2,Total: 20 }, { DrugId: 2, Name: 'Item 2', Price: 15, Quantity: 1, Total: 15 }];
    spyOn(cartService, 'makeOrder');
    spyOn(cartService, 'getCartItems').and.returnValue(cartItems);
  
    component.makeOrder();
  
    expect(cartService.makeOrder).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(cartItems);
  });
});

