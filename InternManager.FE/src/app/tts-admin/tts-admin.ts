import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user'; 
import { UserInfoService } from '../services/userinfo';

@Component({
  selector: 'app-tts-admin',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './tts-admin.html',
  styleUrl: './tts-admin.css',
})
export class TtsAdmin implements OnInit {
  
  ttsList: any[] = []; 
  selectedUser: any = null; 
  selectedProfile: any = null; 
  
  isLoadingList: boolean = false;
  isLoadingProfile: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private userInfoService: UserInfoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchTtsList();
  }

 
  fetchTtsList() {
    this.isLoadingList = true;
    this.userService.getUsers().subscribe({
      next: (response: any[]) => {
    
        this.ttsList = response.filter(user => user.role === 'TTS');
        this.isLoadingList = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy danh sách TTS:', error);
        this.isLoadingList = false;
        this.cdr.detectChanges();
      }
    });
  }


  selectTts(user: any) {
    this.selectedUser = user; 
    this.isLoadingProfile = true;
    this.selectedProfile = null; 
    this.errorMessage = '';


    this.userInfoService.getUserInfoForAdmin(user.id).subscribe({
      next: (res: any) => {
        this.selectedProfile = res;
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoadingProfile = false;
        if (err.status === 404) {
          this.errorMessage = `Thực tập sinh ${user.tendangnhap} chưa cập nhật hồ sơ!`;
        } else {
          this.errorMessage = 'Đã có lỗi xảy ra khi tải hồ sơ hệ thống.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}