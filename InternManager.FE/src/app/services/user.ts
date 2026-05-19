import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Admin/user`; 
  constructor(private http: HttpClient) {}
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, { 
      withCredentials: true 
    });
  }
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { 
      withCredentials: true 
    });
  }


updateUser(userID: number, userData: any) {

  return this.http.put(`${this.apiUrl}/register/${userID}`, userData
    , { withCredentials: true }); 
}
}