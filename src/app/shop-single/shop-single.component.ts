import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestClientServiceService } from '../services/rest-client-service.service';
import { DrugDetails } from '../models/DrugDetails.model';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-shop-single',
  templateUrl: './shop-single.component.html',
  styleUrls: ['./shop-single.component.css', '../app.component.css']
})
export class ShopSingleComponent implements OnInit {
  drugId: string = "";
  drugDetails!: DrugDetails;

  constructor(
    protected _restClientServiceService: RestClientServiceService,
    protected route: ActivatedRoute,
    protected _cartServiceService: CartServiceService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.drugId = params['drugId'];
      this._restClientServiceService.getDrugDetails(this.drugId)
        .subscribe((response: any) => {
          this.drugDetails = response;
        },
          (error: any) => {
            this._cartServiceService.openSnackBar("Error: " + error.error);
          }
        );
    });
  }

  addToCartFromShop(drugId: number, quantity: string): void {
    var intQuantity = parseInt(quantity);
    this._cartServiceService.addToCart(drugId, intQuantity);
  }
}
