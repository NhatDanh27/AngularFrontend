import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiemdanhService } from '../services/diemdanh'; 

interface CalendarDay {
  date: Date;
  dateNumber: number;
  isPast: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  thuTrongTuan: string;
  morning: boolean;
  afternoon: boolean;
  scheduleIds: { morning?: number, afternoon?: number }; 
}

@Component({
  selector: 'app-diem-danh-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diem-danh-user.html',
  styleUrl: './diem-danh-user.css'
})
export class DiemDanhUser implements OnInit {
  currentDate = new Date();
  displayMonth = this.currentDate.getMonth();
  displayYear = this.currentDate.getFullYear();
  
  calendarDays: CalendarDay[] = [];
  isLoading = false;

  constructor(
    private diemdanhService: DiemdanhService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.fetchMySchedules();
  }

 
  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.displayYear, this.displayMonth, 1);
    
    let startDay = new Date(firstDay);
    const dayOfWeek = startDay.getDay(); 
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
    startDay.setDate(startDay.getDate() + diff);

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < 35; i++) {
      const cellDate = new Date(startDay);
      cellDate.setDate(startDay.getDate() + i);

      const daysStr = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

      this.calendarDays.push({
        date: cellDate,
        dateNumber: cellDate.getDate(),
        isPast: cellDate < today,
        isToday: cellDate.getTime() === today.getTime(),
        isCurrentMonth: cellDate.getMonth() === this.displayMonth,
        thuTrongTuan: daysStr[cellDate.getDay()],
        isSunday: cellDate.getDay() === 0,
        isSaturday: cellDate.getDay() === 6,
        morning: false,
        afternoon: false,
        scheduleIds: {}
      });
    }
  }

 
  fetchMySchedules() {
    this.isLoading = true;
    this.diemdanhService.getSchedules().subscribe({
      next: (res: any[]) => {
   
        this.calendarDays.forEach(day => {
            day.morning = false; day.afternoon = false;
            day.scheduleIds = {};
        });

        res.forEach(sch => {
          const schDate = new Date(sch.ngay_dang_ki);
          const day = this.calendarDays.find(d => 
            d.date.getDate() === schDate.getDate() && 
            d.date.getMonth() === schDate.getMonth()
          );

       
          if (day && sch.trang_thai === "dadangki") { 
            if (sch.ca_lam === 'Sáng') {
              day.morning = true;
              day.scheduleIds.morning = sch.id;
            }
            if (sch.ca_lam === 'Chiều') {
              day.afternoon = true;
              day.scheduleIds.afternoon = sch.id;
            }
          }
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Lỗi lấy lịch:", err);
        this.isLoading = false;
      }
    });
  }

  changeMonth(step: number) {
    this.displayMonth += step;
    if (this.displayMonth > 11) {
      this.displayMonth = 0;
      this.displayYear++;
    } else if (this.displayMonth < 0) {
      this.displayMonth = 11;
      this.displayYear--;
    }
    this.generateCalendar();
    this.fetchMySchedules();
  }

 
  getThuTrongTuanInt(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 8 : day + 1; 
  }
  saveSchedule() {
    const newSchedules: any[] = [];
    
    this.calendarDays.filter(d => !d.isPast).forEach(day => {
    
      const dateStr = `${day.date.getFullYear()}-${(day.date.getMonth()+1).toString().padStart(2, '0')}-${day.date.getDate().toString().padStart(2, '0')}`;
      
      
      const thuInt = this.getThuTrongTuanInt(day.date);

      if (day.morning && !day.scheduleIds.morning) {
        newSchedules.push({
          ngay_dang_ki: dateStr,
          ca_lam: 'Sáng',
          thu_trong_tuan: thuInt 
        });
      }
      
      if (day.afternoon && !day.scheduleIds.afternoon) {
        newSchedules.push({
          ngay_dang_ki: dateStr,
          ca_lam: 'Chiều',
          thu_trong_tuan: thuInt 
        });
      }
    });

    if (newSchedules.length === 0) {
      alert('Không có ca làm MỚI nào được chọn để lưu!');
      return;
    }

    this.isLoading = true;
    this.diemdanhService.registerSchedules(newSchedules).subscribe({
      next: (res) => {
        alert(res.message || 'Đăng ký lịch thành công!');
        this.fetchMySchedules(); 
      },
      error: (err) => {
        alert(err.error?.message || 'Có lỗi xảy ra khi lưu lịch.');
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  onCheckboxChange(day: CalendarDay, type: 'morning' | 'afternoon') {
    const isChecked = type === 'morning' ? day.morning : day.afternoon;
    const scheduleId = type === 'morning' ? day.scheduleIds.morning : day.scheduleIds.afternoon;

  
    if (!isChecked && scheduleId) {
      const confirmCancel = confirm(`Bạn có chắc chắn muốn hủy ca ${type === 'morning' ? 'Sáng' : 'Chiều'} ngày ${day.date.getDate()} không?`);
      
      if (confirmCancel) {
        this.isLoading = true;
        this.diemdanhService.cancelSchedule(scheduleId).subscribe({
          next: (res) => {
            alert(res.message || 'Đã hủy lịch thành công.');
            this.fetchMySchedules(); 
          },
          error: (err) => {
            alert('Lỗi khi hủy lịch: ' + (err.error?.message || err.message));
           
            if (type === 'morning') day.morning = true;
            else day.afternoon = true;
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
       
        if (type === 'morning') day.morning = true;
        else day.afternoon = true;
      }
    }
  }
}