import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenServiceService {
  jwtToken: string = "";
  decodedToken!: { [key: string]: string; };

  constructor() { }

  onInit() {
    this.jwtToken = localStorage.getItem("token")!;
    window.addEventListener("storage", this.onStorage.bind(this));
  }

  onStorage(event: StorageEvent) {
    if (event.key === "token") {
      this.jwtToken = event.newValue!;
      // Handle the new token value here
    }
  }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
      localStorage.setItem("token", token);
    }
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  getAccessToken() {
    return this.jwtToken;
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  getUserId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['userId'] : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null as any;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - Date.now() < 5000) ? true : false;
    } else {
      return true;
    }
  }

  logout() {
    this.decodeToken();
    if (this.decodedToken) {
      this.jwtToken = '';
      this.decodedToken = {};
      localStorage.removeItem("token")
    }
  }
}
