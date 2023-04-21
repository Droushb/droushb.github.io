import { Component } from '@angular/core';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { JWTTokenServiceService } from '../services/jwttoken-service.service';
import { Router } from '@angular/router';
import { CartServiceService } from '../services/cart-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', '../app.component.css']
})
export class CartComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'price', 'quantity', 'total', 'remove'];

  constructor(
    protected restClientServiceService: RestClientServiceService,
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected route: Router,
    protected _cartServiceService: CartServiceService,
  ) { }

  ngOnInit(): void {
    this.dataSource.data = this._cartServiceService.getCartItems();
  }

  removeFromCart(drugId: number) {
    this._cartServiceService.removeCartItemById(drugId);
    this.dataSource.data = this._cartServiceService.getCartItems();
  }

  updateQuantity(DrugId: any, event: any) {
    this._cartServiceService.updateCartItemById(DrugId, event.target.value);
    this.dataSource.data = this._cartServiceService.getCartItems();
  }

  makeOrder() {
    this._cartServiceService.makeOrder();
    this._cartServiceService.cleanCart();
    this.dataSource.data = this._cartServiceService.getCartItems();
  }
}
