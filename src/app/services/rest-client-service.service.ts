import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestClientServiceService {
  constructor(
    private http: HttpClient,
  ) { }

  baseUrl = 'http://localhost:5000';

  getDrugs() {
    return this.http.get<any>(this.baseUrl + '/drugs').pipe(
      catchError(error => {
        console.error(error);
        return of({ error: 'Something went wrong' });
      })
    );
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
    return this.http.post(this.baseUrl + '/order', body, { headers: headers });
  }
}
