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
  
  allTasks: any[] = []; 
  ttsUsers: any[] = [];
  
  showForm: boolean = false;
  message: string = '';


  isEditMode: boolean = false;
  editingTaskId: number | null = null;
  
  minDate: string = '';

  newTask: TaskPayloadDTO = {
    userID: 0, 
    ten_task: '',
    deadline: '',
    uu_tiens: 'TrungBinh',
    trangthai: 'ChuaHoanThanh' 
  };

  ngOnInit(): void {
    this.setMinDate();
    this.loadAllTasks();
    this.loadTTSUsers();
  }

  loadAllTasks(): void {
    this.taskService.getAllTasksAdmin().subscribe({
      next: (res) => {
        this.allTasks = res;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Lỗi khi lấy danh sách task admin:', err)
    });
  }

  loadTTSUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
        this.ttsUsers = res.filter(user => user.role === 'TTS');
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Lỗi khi lấy danh sách user:', err)
    });
  }
setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.minDate = `${year}-${month}-${day}`;
  } 
  
  openCreateForm(): void {
    this.isEditMode = false;
    this.showForm = true;
    this.message = '';
    this.editingTaskId = null;
    this.newTask = { userID: 0, ten_task: '', deadline: '', uu_tiens: 'TrungBinh', trangthai: 'ChuaHoanThanh' };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.message = ''; 
  }

 
  editTask(task: any): void {
    this.isEditMode = true;
    this.showForm = true;
    this.message = '';
    this.editingTaskId = task.id; 

    
    let formattedDate = '';
    if (task.deadline) {
      const dateObj = new Date(task.deadline);
      formattedDate = dateObj.toISOString().split('T')[0];
    }

    this.newTask = {
      userID: task.userID || 0, 
      ten_task: task.ten_task,
      deadline: formattedDate,
      uu_tiens: task.uu_tiens || 'TrungBinh',
      trangthai: task.trangthai || 'ChuaHoanThanh'
    };
  }

  submitTask(): void {
    this.newTask.userID = Number(this.newTask.userID);
    if (!this.newTask.userID || !this.newTask.ten_task || !this.newTask.deadline) {
      this.message = 'Lỗi: Vui lòng nhập đầy đủ tên thực tập sinh, Tên task và Deadline.';
      return;
    }

    if (this.newTask.deadline < this.minDate) {
      this.message = 'Lỗi: Deadline không được chọn ngày trong quá khứ.';
      return;
    }

    if (this.isEditMode && this.editingTaskId !== null) {
    
      this.taskService.updateTask(this.editingTaskId, this.newTask).subscribe({
        next: (res) => {
          this.message = 'Cập nhật nhiệm vụ thành công!';
          this.loadAllTasks();
          this.cdr.detectChanges();
          setTimeout(() => { this.showForm = false; }, 1500);
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật task:', err);
          this.message = err.error?.message || 'Lỗi: Không thể cập nhật nhiệm vụ.';
        }
      });
    } else {

      this.taskService.createTask(this.newTask).subscribe({
        next: (res) => {
          this.message = 'Tạo nhiệm vụ thành công!';
          this.loadAllTasks();
          this.cdr.detectChanges();
          setTimeout(() => { this.showForm = false; }, 1500);
        },
        error: (err) => {
          console.error('Lỗi khi tạo task:', err);
          this.message = 'Lỗi: Không thể tạo nhiệm vụ. Kiểm tra lại UserID.';
        }
      });
    }
  }


  deleteTask(id: number): void {
    if (!id) {
      alert('Không tìm thấy ID của nhiệm vụ này để xóa.');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này không?')) {
      this.taskService.deleteTask(id).subscribe({
        next: (res: any) => {
          alert(res.message || 'Xóa thành công');
          this.loadAllTasks();
        },
        error: (err: any) => {
          console.error('Lỗi khi xóa:', err);
          alert(err.error?.message || 'Có lỗi xảy ra khi xóa nhiệm vụ');
        }
      });
    }
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