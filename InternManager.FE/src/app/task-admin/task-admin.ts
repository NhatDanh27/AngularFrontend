import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TaskService, TaskAdminItem, TaskPayloadDTO } from '../services/task';
import { UserService } from '../services/user';
@Component({
  selector: 'app-task-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-admin.html',
  styleUrls: ['./task-admin.css']
})
export class TaskAdmin implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  allTasks: TaskAdminItem[] = [];
  ttsUsers: any[] = [];
  
  showForm: boolean = false;
  message: string = '';

  
  newTask: TaskPayloadDTO = {
    userID: 0, 
    ten_task: '',
    deadline: '',
    uu_tiens: 'TrungBinh',
    trangthai: 'ChuaHoanThanh' 
  };

  ngOnInit(): void {
    this.loadAllTasks();
    this.loadTTSUsers();
  }

  loadAllTasks(): void {
    this.taskService.getAllTasksAdmin().subscribe({
      next: (res) => {
        this.allTasks = res;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => console.error('Lỗi khi lấy danh sách task admin:', err)
    });
  }

  loadTTSUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
       
        this.ttsUsers = res.filter(user => user.role === 'TTS');
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => console.error('Lỗi khi lấy danh sách user:', err)
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.message = ''; 
  
    if (this.showForm) {
      this.newTask = { userID: 0, ten_task: '', deadline: '', uu_tiens: 'Trung bình', trangthai: 'Chưa hoàn thành' };
    }
  }

  submitTask(): void {
    this.newTask.userID = Number(this.newTask.userID);
    if (!this.newTask.userID || !this.newTask.ten_task || !this.newTask.deadline) {
      this.message = 'Lỗi: Vui lòng nhập đầy đủ ID, Tên task và Deadline.';
      return;
    }

    this.taskService.createTask(this.newTask).subscribe({
      next: (res) => {
        this.message = 'Tạo nhiệm vụ thành công!';
        this.loadAllTasks();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showForm = false; 
        }, 1500);
      },
      error: (err) => {
        console.error('Lỗi khi tạo task:', err);
        this.message = 'Lỗi: Không thể tạo nhiệm vụ. Kiểm tra lại UserID.';
      }
    });
  }

  getPriorityClass(priority: string | number): string {
    const p = String(priority).toLowerCase();
    if (p.includes('cao') || p == '1') return 'badge-danger';
    if (p.includes('trung') || p == '2') return 'badge-warning';
    if (p.includes('thấp') || p == '3') return 'badge-success';
    return 'badge-success';
  }

  getStatusClass(status: string): string {
    const s = String(status).toLowerCase();
    if (s.includes('dahoanthanh')) return 'badge-success';
    if (s.includes('chuahoanthanh')) return 'badge-primary';
    return 'badge-secondary';
  }


  getStatusDisplayName(status: string): string {
    const s = String(status).toLowerCase();
    if (s.includes('dahoanthanh')) return 'Đã hoàn thành';
    if (s.includes('chuahoanthanh')) return 'Chưa hoàn thành';
    return status; 
  }

  
  getPriorityDisplayName(priority: string | number): string {
    const p = String(priority).toLowerCase();
    if (p.includes('cao') || p == '1') return 'Cao';
    if (p.includes('trungbinh') || p == '2') return 'Trung bình';
    if (p.includes('thap') || p == '3') return 'Thấp';
    return String(priority);
  }
}