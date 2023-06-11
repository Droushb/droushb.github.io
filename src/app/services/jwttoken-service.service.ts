import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenServiceService {
  jwtToken: string = "";
  decodedToken!: { [key: string]: string; };

  constructor() { }

  onInit() {                             //Цей обробник викликається, коли змінюється стан localStorage на іншій вкладці браузера або в іншому вікні, зберігає токен користувача
    this.jwtToken = localStorage.getItem("token")!;
    window.addEventListener("storage", this.onStorage.bind(this));
  }
  
  onStorage(event: StorageEvent) {       //відстеження змін в localStorage
    if (event.key === "token") {
      this.jwtToken = event.newValue!;
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

  isLoggedIn(): boolean {
    this.decodeToken();
    return this.jwtToken == '' || this.jwtToken == "" ? true : false 
    
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