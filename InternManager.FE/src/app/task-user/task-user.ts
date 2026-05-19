import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, TaskUserItem, TaskPayloadDTO } from '../services/task';
import { UserService } from '../services/user';
@Component({
  selector: 'app-task-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-user.html',
  styleUrls: ['./task-user.css']
})
export class TaskUser implements OnInit {
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);
  myTasks: TaskUserItem[] = [];
  
 
  currentUserId: number = Number(localStorage.getItem('currentUserId')); 

  ngOnInit(): void {
    this.loadMyTasks();

  }

  loadMyTasks(): void {
    this.taskService.getTaskForUser(this.currentUserId).subscribe({
      next: (res) => {
        this.myTasks = res;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Lỗi khi lấy danh sách task user:', err)
    });
  }

  updateProgress(task: TaskUserItem): void {
    const isDone = confirm(`Đánh dấu hoàn thành cho nhiệm vụ: ${task.ten_task}?`);
    if (isDone) {
    
      const payload: TaskPayloadDTO = {
        userID: task.userID,
        ten_task: task.ten_task,
        deadline: task.deadline,
        uu_tiens: task.uu_tien,
        trangthai: 'DaHoanThanh'
      };

      this.taskService.updateTask(task.id, payload).subscribe({
        next: () => {
          alert('Cập nhật thành công!');
          this.loadMyTasks();
          this.cdr.detectChanges();
        },
        error: (err) => alert('Cập nhật thất bại.')
      });
    }
  }

  getPriorityClass(priority: string | number): string {
    const p = String(priority).toLowerCase();
    if (p.includes('cao') || p == '1') return 'badge-danger';
    if (p.includes('trungbinh') || p == '2') return 'badge-warning';
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