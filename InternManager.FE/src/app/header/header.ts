import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-header',
  imports: [RouterModule, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(AuthService); 
  
  showForm = false;
  isAdmin: boolean = false; 

  ngOnInit(): void {
    
    this.isAdmin = this.authService.isAdmin();
  }

  toggleForm() {
    this.showForm = !this.showForm; 
  }

  Logout() {
   
    if (this.authService.logout) {
      this.authService.logout(); 
    }
    
    
    localStorage.removeItem('currentUserId'); 
    localStorage.removeItem('userID'); 
    
    window.location.href = '/login'; 
  }
}