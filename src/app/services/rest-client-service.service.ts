import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestClientServiceService {
  constructor(
    private http: HttpClient,
  ) { }

  baseUrl = 'http://localhost:5000';

  getDrugs() {
    return this.http.get(this.baseUrl + '/drugs');
  }

  getDrugDetails(drugId: any) {
    return this.http.get(this.baseUrl + '/drug/' + drugId.toString());
  }

  login(email: string, password: string) {
    return this.http.post(this.baseUrl + '/login', { email, password });
  }

  register(user: any) {
    return this.http.post(this.baseUrl + '/register', user);
  }

  makeOrder(body: any, headers: any) {
    return this.http.post(this.baseUrl + '/order', body, { headers: headers })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err.message);
        }
      )
    // return this.http.post(this.baseUrl + '/order', JSON.stringify(body), headers);
  }
}
