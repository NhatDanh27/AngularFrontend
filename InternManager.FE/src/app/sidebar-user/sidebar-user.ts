import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.css',
})
export class SidebarUser {
  isSidebarOpen = false; // Mặc định là đóng

  // Hàm bật/tắt sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Hàm tự động đóng sidebar sau khi người dùng bấm chọn một menu để chuyển trang
  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}
