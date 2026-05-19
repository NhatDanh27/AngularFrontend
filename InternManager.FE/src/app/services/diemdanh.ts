import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
@Injectable({
  providedIn: 'root'
})
export class DiemdanhService {
  
  private baseUrl = `${environment.apiUrl}`; 

  constructor(private http: HttpClient) {}

  
  getSchedules(): Observable<any> {
    return this.http.get(`${this.baseUrl}/intern_schedule/intern/schedule`, { withCredentials: true });
  }

  
  registerSchedules(listSchedule: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/intern_schedule/intern/schedule/reg`, listSchedule, { withCredentials: true });
  }


  cancelSchedule(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/intern_schedule/intern/schedule/cancel-status/${id}`, {}, { withCredentials: true });
  }

  getAllSchedulesForAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/intern_schedule/admin/intern/schedule/list`, { withCredentials: true });
  }
}