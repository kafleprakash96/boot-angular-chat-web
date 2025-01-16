import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatLabel,
  MatError,
    MatIcon,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private authService:AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  // Username field
      password: ['', Validators.required]   // Password field
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // Redirect to dashboard or desired route after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Login failed: ' + error.message);
        }
      });
    }
  }
  togglePasswordVisibility(): void{
    this.hidePassword= !this.hidePassword;
  }
}

