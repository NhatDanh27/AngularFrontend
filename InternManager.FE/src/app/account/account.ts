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
  
  usersList: any[] = [];
  
  
  newUser = {
    tendangnhap: '',
    matkhau: '',
    role: 'TTS' 
  };
  
  message = ''; 

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  toggleForm() {
    this.showForm = !this.showForm; 
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

  registerUser() {
    if (!this.newUser.tendangnhap || !this.newUser.matkhau) {
      this.message = 'Vui lòng nhập đầy đủ thông tin!';
      return;   
    }
    else if (!this.newUser.matkhau) {
      this.message = 'Vui lòng nhập mật khẩu!';
      return;
    }
  
  

    this.userService.registerUser(this.newUser).subscribe({
      next: (response: any) => {

        this.message = response.message || 'Thao tác thành công!';
        this.fetchUsers();
     
        this.newUser = { tendangnhap: '', matkhau: '', role: 'TTS' }; 
        this.cdr.detectChanges();
      },
      error: (error: any) => {
      
        this.message = error.error?.message || error.error || 'Lỗi: Đăng ký thất bại';
        this.cdr.detectChanges();
      }
    });
  }
}