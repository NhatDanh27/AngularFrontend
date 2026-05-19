import { Component} from '@angular/core';
import { RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth'; 
@Component({
  selector: 'app-header',
  imports: [RouterModule, FormsModule,CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  
  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm; 
  }
  Logout() {
    localStorage.removeItem('currentUserId'); 
    window.location.href = '/login'; 
  }

}
