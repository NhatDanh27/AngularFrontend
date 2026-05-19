import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiemdanhService } from '../services/diemdanh';
import { UserInfoService } from '../services/userinfo'; 

import { UserService } from '../services/user'; 
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-diem-danh-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diem-danh-admin.html',
  styleUrl: './diem-danh-admin.css'
})
export class DiemDanhAdmin implements OnInit {
  allSchedules: any[] = [];
  filteredSchedules: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  sortOption: string = 'oldest';
  filterThu: string = 'all';
  filterViTri: string = 'all';
  availableViTri: string[] = [];

  days: number[] = [2, 3, 4, 5, 6, 7, 8]; 

  constructor(
    private diemdanhService: DiemdanhService,
    private userInfoService: UserInfoService, 
    private userService: UserService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllSchedules();
  }

  loadAllSchedules() {
    this.isLoading = true;

   
    this.userService.getUsers().subscribe({
      next: (users: any[]) => {
        const allUserIds = users.map(u => u.id);

        if (allUserIds.length === 0) {
          this.fetchSchedulesAndMap(new Map()); 
          return;
        }

    
        const userInfoRequests = allUserIds.map(id =>
          this.userInfoService.getUserInfoForAdmin(id).pipe(
            catchError(err => of(null)) 
          )
        );

        forkJoin(userInfoRequests).subscribe({
          next: (userInfos: any[]) => {
            
            
            const nameToViTriMap = new Map<string, string>();

            userInfos.forEach((info) => {
              if (info && info.hoten) { 
                nameToViTriMap.set(info.hoten.trim().toLowerCase(), info.vitri || 'Chưa cập nhật');
              }
            });

            this.fetchSchedulesAndMap(nameToViTriMap);
          },
          error: (err) => {
            console.error("Lỗi khi lấy thông tin tất cả user:", err);
            this.fetchSchedulesAndMap(new Map());
          }
        });
      },
      error: (err) => {
        console.error("Lỗi lấy danh sách user:", err);
        this.fetchSchedulesAndMap(new Map());
      }
    });
  }


  fetchSchedulesAndMap(nameToViTriMap: Map<string, string>) {
    this.diemdanhService.getAllSchedulesForAdmin().subscribe({
      next: (schedules: any[]) => {
        
       
        const schedulesWithViTri = schedules.map(s => {
          let vitriText = 'Chưa cập nhật';
          if (s.hoten) {
          
            vitriText = nameToViTriMap.get(s.hoten.trim().toLowerCase()) || 'Chưa cập nhật';
          }
          return {
            ...s,
            vitri: vitriText
          };
        });

        this.allSchedules = this.groupSchedules(schedulesWithViTri);

        const vitriSet = new Set(this.allSchedules.map(item => item.vitri).filter(vt => vt && vt !== 'Chưa cập nhật'));
        this.availableViTri = Array.from(vitriSet) as string[];

        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Lỗi tải danh sách lịch:", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  processAndRenderSchedules(schedules: any[], userInfoMap: Map<number, string>) {
    const schedulesWithViTri = schedules.map(s => ({
      ...s,
      vitri: s.userID ? (userInfoMap.get(s.userID) || 'Chưa cập nhật') : 'Chưa cập nhật'
    }));

    this.allSchedules = this.groupSchedules(schedulesWithViTri);
    

    const vitriSet = new Set(this.allSchedules.map(item => item.vitri).filter(vt => vt && vt !== 'Chưa cập nhật'));
    this.availableViTri = Array.from(vitriSet) as string[]; 

    this.applyFilters();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  groupSchedules(data: any[]): any[] {
    const grouped = new Map<string, any>();

    data.forEach(item => {
      const key = `${item.hoten}_${item.ngay_dang_ki}`;
      if (!grouped.has(key)) {
        grouped.set(key, { ...item, allShifts: [item.ca_lam] });
      } else {
        grouped.get(key).allShifts.push(item.ca_lam);
      }
    });

    return Array.from(grouped.values()).map(group => {
      const shifts = group.allShifts;
      if (shifts.includes('Sáng') && shifts.includes('Chiều')) {
        group.caHienThi = 'Cả ngày';
      } else {
        group.caHienThi = shifts[0]; 
      }
      return group;
    }).sort((a, b) => new Date(a.ngay_dang_ki).getTime() - new Date(b.ngay_dang_ki).getTime());
  }

  applyFilters() {
    let result = [...this.allSchedules];

  
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

  
    result = result.filter(s => {
      const dateObj = new Date(s.ngay_dang_ki);
      dateObj.setHours(0, 0, 0, 0); 

      return dateObj.getMonth() === currentMonth && 
             dateObj.getFullYear() === currentYear &&
             dateObj.getTime() >= now.getTime();
    });

 
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s => s.hoten.toLowerCase().includes(term));
    }

  
    if (this.filterThu !== 'all') {
      result = result.filter(s => s.thu_trong_tuan === Number(this.filterThu));
    }

   
    if (this.filterViTri !== 'all') {
      result = result.filter(s => s.vitri === this.filterViTri);
    }


    result.sort((a, b) => {
      const dateA = new Date(a.ngay_dang_ki);
      const dateB = new Date(b.ngay_dang_ki);

      switch (this.sortOption) {
        case 'newest': return dateB.getTime() - dateA.getTime();
        case 'oldest': return dateA.getTime() - dateB.getTime();
        case 'thu_asc': return a.thu_trong_tuan - b.thu_trong_tuan;
        default: return dateB.getTime() - dateA.getTime();
      }
    });

    this.filteredSchedules = result;
    this.cdr.detectChanges();
  }

  getThuText(thu: number): string {
    return thu === 8 ? 'Chủ Nhật' : `Thứ ${thu}`;
  }
}