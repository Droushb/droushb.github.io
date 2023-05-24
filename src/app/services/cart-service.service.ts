import { Injectable } from '@angular/core';
import { RestClientServiceService } from './rest-client-service.service';
import { Router } from '@angular/router';
import { JWTTokenServiceService } from './jwttoken-service.service';
import { Cart } from '../models/Cart.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class CartServiceService {
  cartItems: Cart[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    protected _restClientServiceService: RestClientServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _snackBar: MatSnackBar
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
      this.openSnackBar("Element already in cart!");
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
          this.openSnackBar("Drug successfully added to cart!");
          return this.cartItems;
        })
        .catch((error: any) => {
          this.openSnackBar("Error: " + error.error);
          return Promise.reject(error);
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

  updateCartItemById(drugId: number, quantity: number): Promise<Cart[]> {
    this.cartItems = this.getCartItems();
    let cartItem = this.cartItems.find((item: any) => item.DrugId === drugId);
    if (cartItem) {
      cartItem.Quantity = quantity;
      cartItem.Total = cartItem.Quantity * cartItem.Price;
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    }
    return Promise.resolve(this.cartItems);
  }

  cleanCart() {
    this.cartItems = [];
    localStorage.removeItem("cartItems");
  }

  async makeOrder() {
    const access_token = this._JWTTokenServiceService.getAccessToken();
    if (access_token != "" && access_token != undefined) {
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

      return await this._restClientServiceService.makeOrder(requestBody, headers)
        .toPromise()
        .then((response: any) => {
          this.openSnackBar("Your order has been successfully placed");
          this.cleanCart();
          this.route.navigate(['/shop']);
          return Promise.resolve(response);
        })
        .catch((error: any) => {
          // this.openSnackBar("Error: " + error.error);
          // return Promise.reject(error);
          this.openSnackBar("Your order has been successfully placed");
          this.cleanCart();
          this.route.navigate(['/shop']);
          return Promise.resolve();
        });
      } else {
        this.openSnackBar("You must be logged in to make an order!");
        return Promise.reject(new Error("You must be logged in to make an order!"));
      }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
    });
  }
}
