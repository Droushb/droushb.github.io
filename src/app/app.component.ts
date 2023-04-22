import { Component } from '@angular/core';
import { JWTTokenServiceService } from './services/jwttoken-service.service';
import { BehaviorSubject } from 'rxjs';
import { CartServiceService } from './services/cart-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pharmacy-website';
  public isTokenExpired$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numOfCartItems: number = 0;

  constructor(
    protected _JWTTokenServiceService: JWTTokenServiceService,
    protected _cartServiceService: CartServiceService) {
  }

  ngOnInit(): void {
    setInterval(() => {
      const isExpired = this._JWTTokenServiceService.isTokenExpired();
      this.isTokenExpired$.next(isExpired);
      this.numOfCartItems = this._cartServiceService.getCartItems().length;
    }, 1000);
  }

  logout() {
    this._JWTTokenServiceService.logout();
    this.isTokenExpired$.next(true);
    this._cartServiceService.openSnackBar("You successfully logged out!");
  }
}
