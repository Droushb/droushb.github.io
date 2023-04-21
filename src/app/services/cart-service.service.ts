import { Injectable } from '@angular/core';
import { RestClientServiceService } from './rest-client-service.service';
import { Router } from '@angular/router';
import { JWTTokenServiceService } from './jwttoken-service.service';
import { Cart } from '../models/Cart.model';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { CartComponent } from '../cart/cart.component';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  cartItems: Cart[] = [];

  constructor(
    protected _restClientServiceService: RestClientServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
  ) { }

  getCartItems(): Cart[] {
    const cartItemsJson = localStorage.getItem("cartItems");
    if (cartItemsJson) {
      return JSON.parse(cartItemsJson);
    } else {
      return [];
    }
  }

  async addToCart(drugId: number, quantity: number): Promise<any[]> {
    this.cartItems = this.getCartItems();
    let cartItem = this.cartItems?.find((item: any) => item.DrugId === drugId);
    if (cartItem) {
      cartItem.Quantity = Number(cartItem.Quantity) + quantity;
      cartItem.Total = cartItem.Quantity * cartItem.Price;
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      return Promise.resolve(this.cartItems);
    } else {
      return this._restClientServiceService.getDrugDetails(drugId)
        .toPromise()
        .then((response: any) => {
          cartItem = {
            DrugId: drugId,
            Name: response.Name,
            Price: response.Price,
            Quantity: quantity,
            Total: response.Price * quantity
          } as Cart;
          this.cartItems.push(cartItem);
          localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
          return this.cartItems;
        });
    }
  }

  removeCartItemById(drugId: number) {
    this.cartItems = this.getCartItems();
    const index = this.cartItems.findIndex((item: any) => item.DrugId == drugId);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    }
  }

  updateCartItemById(drugId: number, quantity: number) {
    this.cartItems = this.getCartItems();
    let cartItem = this.cartItems.find((item: any) => item.DrugId === drugId);
    if (cartItem) {
      cartItem.Quantity = quantity;
      cartItem.Total = cartItem.Quantity * cartItem.Price;
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      return Promise.resolve(this.cartItems);
    }
    return;
  }

  cleanCart() {
    this.cartItems = [];
    localStorage.removeItem("cartItems");
  }

  async makeOrder() {
    const access_token = this._JWTTokenServiceService.getAccessToken();
    if (access_token != "" || access_token != undefined) {
      this.cartItems = this.getCartItems();
      const userId = this._JWTTokenServiceService.getUserId();
      const items = this.cartItems.map(item => {
        return {
          idDrug: item.DrugId,
          quantity: item.Quantity
        }
      });

      const requestBody = {
        idUser: userId,
        idStatus: 4,
        items: items
      };

      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      };

      await this._restClientServiceService.makeOrder(requestBody, headers);
      this.cleanCart();
      // CartComponent.ngOnInit();
    }
    return;
  }
}

  // fetch('http://localhost:5000/order', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + access_token
  //   },
  //   body: JSON.stringify(requestBody)
  // })
  //   .then(response => {
  //     if (response.ok) {
  //       let cartItems = [];
  //       localStorage.setItem('cartItems', JSON.stringify(cartItems));
  //       window.location = 'thankyou.html'
  //     } else {
  //       // response status code is outside the 200-299 range
  //       throw new Error('HTTP status ' + response.status);
  //     }
  //   })
  //   .then(data => {
  //     console.log(data.access_token);
  //   })
  //   .catch(error => activeToaster("Error", error));
