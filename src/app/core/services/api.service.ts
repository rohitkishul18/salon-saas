import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) { }

getHomeData(salonSlug: string) {
  return this.http.get(`${this.apiUrl}/home/${salonSlug}`);
}

getBranchBySlug(branchSlug: string) {
  return this.http.get(`${this.apiUrl}/branch/${branchSlug}`);
}

}
