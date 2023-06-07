import { Component, OnInit } from '@angular/core';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css', '../app.component.css']
})
export class ShopComponent implements OnInit {
  drugList: any[] = [];

  constructor(
    protected _restClientServiceService: RestClientServiceService,
    protected _cartServiceService: CartServiceService,
  ) { }

  ngOnInit(): void {
    this._restClientServiceService.getDrugs()
      .subscribe(
        (response: any) => {
          this.drugList = response;
        },
        (error: any) => {
          this._cartServiceService.openSnackBar("Error: " + error.error);
        }
      );
  }

  addToCartFromShop(drugId: number): void {
    this._cartServiceService.addToCart(drugId, 1);
  }
}
