import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../interface/user';
import { AuthService } from '../../services/auth.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RoomCardComponent } from '../room-card/room-card.component';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-profile',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isCurrentUser = false;
  isEditing = false;
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.loadUserProfile(username);
      } else {
        this.loadCurrentUserProfile();
      }
    });
  }
  

  private loadUserProfile(username: string): void {
    this.profileService.getUserProfile(username).subscribe(user => {
      this.user = user;
      this.profileService.currentUser$.subscribe(currentUser => {
        this.isCurrentUser = currentUser?.id === user.id;
      });
    });
  }

  private loadCurrentUserProfile(): void {
    this.profileService.currentUser$.subscribe(user => {
      this.user = user;
      this.isCurrentUser = true;
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }

  onEditProfile(): void {
    this.isEditing = true;
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: (user) => {
          this.user = user;
          this.isEditing = false;
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isValidImageFile(file)) {
        this.uploadImage(file);
      } else {
        this.snackBar.open('Please select a valid image file (JPG, PNG, or JPEG)', 'Close', { duration: 3000 });
      }
    }
  }

  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }

  private uploadImage(file: File): void {
    this.profileService.updateProfilePicture(file).subscribe({
      next: (user) => {
        this.user = user;
        this.snackBar.open('Profile picture updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error updating profile picture', 'Close', { duration: 3000 });
      }
    });
  }
}
