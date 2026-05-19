import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInfoService } from '../services/userinfo';

@Component({
  selector: 'app-tts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tts.html',
  styleUrl: './tts.css'
})
export class Tts implements OnInit {

  internProfile: any = null;
  

  editableProfile = {
    userID: null as number | null, 
    hoten: '',
    truong: '', vitri: '', nganh: '', sdt: '', email: '', linkfb: '', ngaysinh: ''
  };

  constructor(
    private userInfoService: UserInfoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
  
    const currentId = Number(localStorage.getItem('currentUserId'));
    
    if (!currentId) {
      console.warn('Bạn chưa đăng nhập.');
      return; 
    }

   
    this.editableProfile.userID = currentId;

   
    this.userInfoService.getUserInfo(currentId).subscribe({
      next: (res: any) => {
     
        this.internProfile = res;
    
        this.editableProfile = { ...res };
          
        this.cdr.detectChanges();
      },
      error: (err: any) => {
     
        if (err.status === 404) {
      
          this.internProfile = null; 
          console.log('Người dùng chưa có hồ sơ. Form để trống.');
        } else {
          console.error('Lỗi khi lấy dữ liệu hồ sơ:', err);
        }
        this.cdr.detectChanges();
      }
    });
  }

  onSave() {
    if (!this.editableProfile.hoten) {
      alert('Vui lòng nhập Họ tên!');
      return;
    }

    if (this.internProfile === null) {
    
      this.userInfoService.registerInfo(this.editableProfile).subscribe({
        next: (res: any) => {
          alert(res.message || 'Lưu hồ sơ thành công!');
        
          this.loadProfile();
        },
        error: (err: any) => {
          alert(err.error?.message || err.error || 'Đã có lỗi xảy ra.');
        }
      });
    } else {
      
      this.userInfoService.updateInfo(this.internProfile.userID, this.editableProfile).subscribe({
        next: (res: any) => {
          alert(res.message || 'Cập nhật thành công!');
     
          this.loadProfile();
        },
        error: (err: any) => {
          alert(err.error?.message || err.error || 'Đã có lỗi xảy ra.');
        }
      });
    }
  }
}