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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  // Username field
      password: ['', Validators.required]   // Password field
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post<any>('http://localhost:8080/api/v1/auth/login', loginData).subscribe(
        (response:any) => {

          localStorage.setItem('token', response.token);
          console.log(response.token)
          this.router.navigate(['/dashboard']);
        },
        (error:any) => {
          // Handle error (e.g., show an error message)
          alert('Login failed: ' + error.message);
        }
      );
    }
  }
  togglePasswordVisibility(): void{
    this.hidePassword= !this.hidePassword;
  }
}

