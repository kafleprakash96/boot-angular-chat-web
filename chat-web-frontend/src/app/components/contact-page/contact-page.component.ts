import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact-page',
  imports: [MatCardModule,
  ReactiveFormsModule,MatFormField,MatInputModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log("Name: ", this.contactForm.get('name')?.value )
      // Send form data to the backend
      this.http.post('/api/contact/send', this.contactForm.value).subscribe(
        response => {
          console.log('Message sent successfully:', response);
          alert('Your message has been sent!');
        },
        error => {
          console.error('Error sending message:', error);
          alert('There was an error sending your message.');
        }
      );
    }
  }

}
