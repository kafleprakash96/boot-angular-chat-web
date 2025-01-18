import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule,
      ReactiveFormsModule,
      RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatLabel,
    MatError,
      MatIcon,
      MatInputModule,
      MatButtonModule,
      MatCardModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', ],
      lastname: ['', ],
      username: ['',],
      email: ['', ],  
      password: ['',],
      bio: ['']   
    });
    
  }
  

  passwordMatchValidator(group: FormGroup): null | object {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    console.log(this.registerForm.get('firstName')?.errors);
    if (this.registerForm.invalid) {
      return; // If the form is invalid, do nothing
    }

    const user = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      bio: this.registerForm.get('bio')?.value
    };
    console.log(user);

    // Call the registration method in your AuthService
    this.authService.register(user).subscribe({
      next : (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Navigate to login page after successful registration
      },
       error: (error) => {
        console.error('Registration error', error);
        // Handle errors here (e.g., show a message to the user)
      }
    }
    );
  }
  togglePasswordVisibility(): void{
    this.hidePassword= !this.hidePassword;
  }

}
