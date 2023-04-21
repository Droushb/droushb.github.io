import { Component } from '@angular/core';
import { JWTTokenServiceService } from './services/jwttoken-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pharmacy-website';
  public isTokenExpired$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected _JWTTokenServiceService: JWTTokenServiceService) {
  }

  ngOnInit(): void {
    setInterval(() => {
      const isExpired = this._JWTTokenServiceService.isTokenExpired();
      this.isTokenExpired$.next(isExpired);
    }, 1000);
  }

  logout() {
    this._JWTTokenServiceService.logout();
    this.isTokenExpired$.next(true);
  }
}
