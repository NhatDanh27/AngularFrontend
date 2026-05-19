
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environments';
export interface LoginRequest {
  tenDangNhap: string;
  matKhau: string;
}

export interface UserInfo {
  id: number;
  tendangnhap: string;
  role: string | null;
}

export interface LoginResponse {
  message: string;
  user: UserInfo;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private apiUrl = `${environment.apiUrl}/authen/login`; 

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials, {
      withCredentials: true 
    }).pipe(
      
      tap(response => {
        if (response && response.user) {
        
          localStorage.setItem('userRole', response.user.role || '');
        }
      })
    );
  }

isAdmin(): boolean {
  if (typeof window !== 'undefined') { 
    const role = localStorage.getItem('userRole');
    return role === 'Admin';
  }
  return false;
}

isUser(): boolean {
  if (typeof window !== 'undefined') { 
    const role = localStorage.getItem('userRole');
    return role === 'User';
  }
  return false;
}

 
  logout() {
    localStorage.removeItem('userRole');
    
  }
}