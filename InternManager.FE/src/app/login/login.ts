import { Component,ChangeDetectorRef } from '@angular/core';
import {  FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      tenDangNhap: ['', [Validators.required]],
      matKhau: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    this.errorMessage = '';

  
    const requestData: LoginRequest = {
      tenDangNhap: this.loginForm.get('tenDangNhap')?.value,
      matKhau: this.loginForm.get('matKhau')?.value
    };

    this.authService.login(requestData).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('currentUserId', res.user.id.toString());
        
        if (res.user.role === 'Admin') {
          this.router.navigate(['/account']); 
        } else {
          this.router.navigate(['/diem-danh-user']); 
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Tài khoản hoặc mật khẩu không đúng.';
          this.cdr.detectChanges();
        } else {
          this.errorMessage = 'Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.';
          this.cdr.detectChanges();
        }
      }
    });
  }
  
}