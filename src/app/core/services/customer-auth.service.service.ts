import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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

forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, data); 
  }

  // Uncomment and fix resetPassword similarly when ready
  resetPassword(data: { token: string; email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password`, data);
  }



}
