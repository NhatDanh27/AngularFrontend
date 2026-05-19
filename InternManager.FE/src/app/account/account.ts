import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user';

@Component({
  selector: 'app-tts',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  showForm: boolean = false;
  isEditMode: boolean = false; 
  editingUserId: number | null = null;
  usersList: any[] = [];
  
 
  currentUserId: number | null = null; 
  
  newUser = {
    tendangnhap: '',
    matkhau: '',
    role: 1,
    userStatus: 0
  };
  
  message = ''; 

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.getCurrentUser(); 
  }

  
  getCurrentUser() {
    
    const userIdStr = localStorage.getItem('currentUserId'); 
    
    if (userIdStr) {
      
      this.currentUserId = parseInt(userIdStr, 10); 
    }
  }

  toggleForm() {
    this.showForm = !this.showForm; 
    if (this.showForm) {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  resetForm() {
    this.newUser = { tendangnhap: '', matkhau: '', role: 1, userStatus: 0 };
    this.editingUserId = null;
  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.usersList = response; 
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        if (error.status === 401) {
          console.error('Bạn chưa đăng nhập hoặc không có quyền Admin!');
        } else {
          console.error('Lỗi khi gọi API danh sách:', error);
        }
      }
    });
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.showForm = true;
    this.editingUserId = user.id;
    
    console.log("Dữ liệu user từ API:", user); 

    this.newUser = {
      tendangnhap: user.tendangnhap,
      matkhau: '', 
      role: user.role, 
      userStatus: user.userStatus !== undefined ? user.userStatus : 0 
    };
  }

  submitForm() {
    if (!this.newUser.tendangnhap) {
      this.message = 'Vui lòng nhập tên đăng nhập!';
      return;   
    }

    if (this.isEditMode) {
      if (!this.editingUserId) return;
      
      this.userService.updateUser(this.editingUserId, this.newUser).subscribe({
        next: (response: any) => {
          this.message = typeof response === 'string' ? response : (response.message || 'Cập nhật thành công!');
          this.fetchUsers();
          setTimeout(() => this.showForm = false, 1500); 
        },
        error: (error: any) => {
          if (typeof error.error === 'string') {
            this.message = 'Lỗi: ' + error.error;
          } else if (error.error?.message) {
            this.message = 'Lỗi: ' + error.error.message;
          } else {
            this.message = 'Lỗi: Cập nhật thất bại';
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      if (!this.newUser.matkhau) {
        this.message = 'Vui lòng nhập mật khẩu!';
        return;
      }

      this.userService.registerUser(this.newUser).subscribe({
        next: (response: any) => {
          this.message = response.message || 'Thao tác thành công!';
          this.fetchUsers();
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.message = error.error?.message || error.error || 'Lỗi: Đăng ký thất bại';
          this.cdr.detectChanges();
        }
      });
    }
  }


  deleteUser(id: number) {
   
    if (this.currentUserId === id) {
      alert('Tài khoản đang được bạn sử dụng, không thể xóa');
      return; 
    }

    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      this.userService.deleteUser(id).subscribe({
        next: (response: any) => {
          alert(response.message || 'Xóa thành công');
          this.fetchUsers();
        },
        error: (error: any) => {
          alert(error.error?.message || error.error || 'Có lỗi xảy ra khi xóa');
        }
      });
    }
  }
}