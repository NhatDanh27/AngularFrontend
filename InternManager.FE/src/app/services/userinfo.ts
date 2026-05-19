
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private baseUrl = `${environment.apiUrl}/User/user`;
  private adminUrl = `${environment.apiUrl}/Admin/user`;
  constructor(private http: HttpClient) {}

  
  getUserInfoForAdmin(userID: number): Observable<any> {

    return this.http.get(`${this.adminUrl}/info/${userID}`, { withCredentials: true });
  }

  getUserInfo(userID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/register-info/${userID}`, { withCredentials: true });
  }


  registerInfo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-info`, data, { withCredentials: true });
  }

  
  updateInfo(userID: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/register-info/${userID}`, data, { withCredentials: true });
  }

 
  deleteInfo(userID: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/register-info/${userID}`, { withCredentials: true });
  }


}