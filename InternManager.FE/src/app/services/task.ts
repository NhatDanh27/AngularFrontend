import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

export interface TaskPayloadDTO {
  userID: number;
  ten_task: string;
  deadline: string | Date;
  uu_tiens: string | number; 
  trangthai: string;
}


export interface TaskUserItem {
  id: number;
  userID: number;
  ten_task: string;
  deadline: string;
  uu_tien: string | number;
  trangthai: string;
}


export interface TaskAdminItem {
  hoten: string;
  ten_task: string;
  deadline: string;
  uu_tiens: string | number; 
  trangthai: string;
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}`; 


  getTaskForUser(userID: number): Observable<TaskUserItem[]> {
    return this.http.get<TaskUserItem[]>(`${this.apiUrl}/task/task/list?userID=${userID}`, { withCredentials: true });
  }

 
  getAllTasksAdmin(): Observable<TaskAdminItem[]> {
    return this.http.get<TaskAdminItem[]>(`${this.apiUrl}/task/admin/task/list`, { withCredentials: true });
  }

 
  createTask(task: TaskPayloadDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/task/task`, task, { withCredentials: true });
  }

 
  updateTask(id: number, task: TaskPayloadDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/task/task/${id}`, task, { withCredentials: true });
  }

 
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/task/task/${id}`, { withCredentials: true });
  }
}