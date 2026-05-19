import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiemdanhService } from '../services/diemdanh';

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

  
  sortOption: string = 'newest';
  filterThu: string = 'all';
  filterMonth: string = 'all';
  filterYear: string = 'all';

  days: number[] = [2, 3, 4, 5, 6, 7, 8]; 
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  availableYears: number[] = [];

  constructor(
    private diemdanhService: DiemdanhService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllSchedules();
  }

  loadAllSchedules() {
    this.isLoading = true;
    this.diemdanhService.getAllSchedulesForAdmin().subscribe({
      next: (res: any[]) => {
       
        this.allSchedules = this.groupSchedules(res);
        const years = new Set(this.allSchedules.map(item => new Date(item.ngay_dang_ki).getFullYear()));
        this.availableYears = Array.from(years).sort((a, b) => b - a); 

        
        this.applyFilters();
        this.filteredSchedules = [...this.allSchedules];
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
    }).sort((a, b) => new Date(b.ngay_dang_ki).getTime() - new Date(a.ngay_dang_ki).getTime());
  }

  
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredSchedules = [...this.allSchedules];
    } else {
      this.filteredSchedules = this.allSchedules.filter(s => 
        s.hoten.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

 applyFilters() {
    let result = [...this.allSchedules];

  
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s => s.hoten.toLowerCase().includes(term));
    }

    
    if (this.filterThu !== 'all') {
      result = result.filter(s => s.thu_trong_tuan === Number(this.filterThu));
    }

    if (this.filterMonth !== 'all') {
      result = result.filter(s => new Date(s.ngay_dang_ki).getMonth() + 1 === Number(this.filterMonth));
    }

   
    if (this.filterYear !== 'all') {
      result = result.filter(s => new Date(s.ngay_dang_ki).getFullYear() === Number(this.filterYear));
    }

    
    result.sort((a, b) => {
      const dateA = new Date(a.ngay_dang_ki);
      const dateB = new Date(b.ngay_dang_ki);

      switch (this.sortOption) {
        case 'newest': 
          return dateB.getTime() - dateA.getTime();
        case 'oldest': 
          return dateA.getTime() - dateB.getTime();
        case 'thu_asc': 
          return a.thu_trong_tuan - b.thu_trong_tuan;
        case 'month_asc':
          return dateA.getMonth() - dateB.getMonth();
        case 'year_desc':
          return dateB.getFullYear() - dateA.getFullYear();
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    this.filteredSchedules = result;
    this.cdr.detectChanges();
  }
  getThuText(thu: number): string {
    return thu === 8 ? 'Chủ Nhật' : `Thứ ${thu}`;
  }
}