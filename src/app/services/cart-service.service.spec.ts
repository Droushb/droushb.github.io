import { TestBed } from '@angular/core/testing';
import { CartServiceService } from './cart-service.service';
import { RestClientServiceService } from './rest-client-service.service';
import { Router } from '@angular/router';
import { JWTTokenServiceService } from './jwttoken-service.service';
import { Cart } from '../models/Cart.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CartServiceService', () => {
  let service: CartServiceService;
  let restClientService: RestClientServiceService;
  let router: Router;
  let jwtTokenService: JWTTokenServiceService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        HttpClientTestingModule,
        MatSnackBarModule, // Update the import here
      ],
      providers: [
        JWTTokenServiceService,
        CartServiceService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(CartServiceService);
    restClientService = TestBed.inject(RestClientServiceService);
    router = TestBed.inject(Router);
    jwtTokenService = TestBed.inject(JWTTokenServiceService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  beforeEach(() => {
    service = TestBed.inject(CartServiceService);
    restClientService = TestBed.inject(RestClientServiceService);
    router = TestBed.inject(Router);
    jwtTokenService = TestBed.inject(JWTTokenServiceService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should return empty cart if Local Storage is empty', () =>{
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = service.getCartItems();
    expect(result).toEqual([]);
  });


  it('should add item to cart', async () => {
    const drugId = 1;
    const quantity = 2;
    const cartItems = [
      { DrugId: 2, Name: 'Item 2' },
    ] as Cart[];

    spyOn(service, 'getCartItems').and.returnValue(cartItems);
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(cartItems));
    spyOn(localStorage, 'setItem');

    const result = await service.addToCart(drugId, quantity);

    expect(service.getCartItems).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify([...cartItems, {
      DrugId: drugId,
      Name: '',
      Price: 0,
      Quantity: quantity,
      Total: 0,
    }]));
    expect(result).toEqual([...cartItems, {
      DrugId: drugId,
      Name: '',
      Price: 0,
      Quantity: quantity,
      Total: 0,
    }]);
  });

  it('should return cart items', () => {
    const cartItems = [
      { DrugId: 1, Name: 'Item 1', Quantity: 2, Price: 10, Total: 20 },
      { DrugId: 2, Name: 'Item 2', Quantity: 1, Price: 5, Total: 5 },
    ] as Cart[];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(cartItems));

    const result = service.getCartItems();

    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
    expect(result).toEqual(cartItems);
  });

  it('should remove an item from the cart', () => {
    const itemId = 1;
    service.cartItems = [
      { DrugId: itemId, Name: 'Item 1', Quantity: 2, Price: 10, Total: 20 },
      { DrugId: 2, Name: 'Item 2', Quantity: 1, Price: 5, Total: 5 },
    ] as Cart[];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(service.cartItems));
    spyOn(localStorage, 'setItem');
    service.removeCartItemById(itemId);
    expect(service.cartItems.length).toBe(1);
    expect(service.cartItems[0]).toEqual({ DrugId: 2, Name: 'Item 2', Quantity: 1, Price: 5, Total: 5 });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cartItems',
      JSON.stringify(service.cartItems)
    );
  });

  it('should update the cart item by id', () => {
    const itemId = 1;
    const updatedItem = { DrugId: itemId, Name: 'Item 1', Quantity: 3, Price: 10, Total: 30 };
    service.cartItems = [
      { DrugId: itemId, Name: 'Item 1', Quantity: 2, Price: 10, Total: 20 },
      { DrugId: 2, Name: 'Item 2', Quantity: 1, Price: 5, Total: 5 },
    ] as Cart[];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(service.cartItems));
    spyOn(localStorage, 'setItem');

    service.updateCartItemById(itemId, 3);

    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', JSON.stringify([updatedItem, {
      DrugId: 2,
      Name: 'Item 2',
      Quantity: 1,
      Price: 5,
      Total: 5,
    }]));
    expect(service.cartItems).toEqual([updatedItem, {
      DrugId: 2,
      Name: 'Item 2',
      Quantity: 1,
      Price: 5,
      Total: 5,
    }]);
  });

  it('should clean the cart', () => {
    spyOn(localStorage, 'removeItem');

    service.cleanCart();

    expect(localStorage.removeItem).toHaveBeenCalledWith('cartItems');
  });

  it('should handle an error when making an order', async () => {
    spyOn(service['_JWTTokenServiceService'], 'getAccessToken').and.returnValue('access_token');
    spyOn(service['_JWTTokenServiceService'], 'getUserId').and.returnValue('user_id');
    spyOn(service, 'getCartItems').and.returnValue([
      { DrugId: 2, Name: 'Item 2', Quantity: 1, Price: 5, Total: 5 },
    ]);
    spyOn(service['_restClientServiceService'], 'makeOrder').and.returnValue(
      throwError({ error: 'Error making an order' })
    );
    spyOn(service, 'openSnackBar');
    spyOn(service, 'cleanCart');
    spyOn(service['route'], 'navigate');
  
    try {
      await service.makeOrder();
      expect(service.openSnackBar).toHaveBeenCalledWith('Error: Error making an order');
      expect(service.cleanCart).toHaveBeenCalled();
      expect(service['route'].navigate).toHaveBeenCalledWith(['/store/inventory']);
    } catch (error) {
      expect(error).toEqual({ error: 'Error making an order' });
    }
  });

  it('should handle make order without access token', async () => {
    spyOn(jwtTokenService, 'getAccessToken').and.returnValue('');
    spyOn(service, 'openSnackBar');

    try {
      await service.makeOrder();
    } catch (error) {
      expect(service.openSnackBar).toHaveBeenCalledWith("You must be logged in to make an order!");
      expect(error).toEqual("You must be logged in to make an order!");
    }
  });

  it('should open snack bar', () => {
    spyOn(snackBar, 'open');

    service.openSnackBar('Message');

    expect(snackBar.open).toHaveBeenCalledWith('Message', 'OK', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      duration: 5000,
    });
  });
});
