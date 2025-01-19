import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-page',
  imports: [MatCardModule,
  ReactiveFormsModule,MatFormField,MatInputModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    //Todo : Integrate email with backend
    console.log("Email sent");
  }

  onCancel() {
    // Navigate back to the Home page
    this.router.navigate(['/']);
  }

}
