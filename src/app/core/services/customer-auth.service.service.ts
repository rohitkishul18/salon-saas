import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthService {

  private API_URL = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.API_URL}/auth/login`, data);
  }

 register(data: any) {
  return this.http.post(`${this.API_URL}/auth/register?salonSlug=${environment.salonSlug}`, data);
}
}
