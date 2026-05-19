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
    truong: '', 
    vitri: '', 
    nganh: '', 
    sdt: '', 
    email: '', 
    linkfb: '', 
    ngaysinh: ''
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
    const p = this.editableProfile;

    // 1. Kiểm tra Họ tên
    if (!p.hoten || !p.hoten.trim()) {
      alert('Vui lòng nhập Họ tên!');
      return;
    }

    // 2. Kiểm tra Ngày sinh
    if (!p.ngaysinh) {
      alert('Vui lòng chọn Ngày sinh!');
      return;
    }

    // 3. Kiểm tra Số điện thoại (Bắt buộc 10 số, bắt đầu bằng số 0)
    if (!p.sdt || !p.sdt.trim()) {
      alert('Vui lòng nhập Số điện thoại!');
      return;
    }
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(p.sdt)) {
      alert('Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số bắt đầu bằng số 0.');
      return;
    }

    // 4. Kiểm tra Email (Bắt buộc đuôi @gmail.com)
    if (!p.email || !p.email.trim()) {
      alert('Vui lòng nhập Email!');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(p.email)) {
      alert('Email không đúng định dạng! Vui lòng nhập email có đuôi @gmail.com');
      return;
    }

    // 5. Kiểm tra Trường học
    if (!p.truong || !p.truong.trim()) {
      alert('Vui lòng nhập Trường học!');
      return;
    }

    // 6. Kiểm tra Chuyên ngành
    if (!p.nganh || !p.nganh.trim()) {
      alert('Vui lòng nhập Chuyên ngành!');
      return;
    }

    // 7. Kiểm tra Vị trí thực tập
    if (!p.vitri) {
      alert('Vui lòng chọn Vị trí thực tập!');
      return;
    }

    // Nếu vượt qua tất cả các bài kiểm tra, tiến hành gọi API
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