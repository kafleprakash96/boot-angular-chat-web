import { Component,  ElementRef,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject,switchMap,tap,pipe,take } from 'rxjs';
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
import {MatTabsModule} from '@angular/material/tabs';



@Component({
  selector: 'app-profile',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isCurrentUser = false;
  isEditing = false;
  profileForm: FormGroup;

  @ViewChild('profilePhotoInput') profilePhotoInput !: ElementRef;
  @ViewChild('coverPhotoInput') coverPhotoInput !: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: ['', Validators.maxLength(500)],
      location: [''],
      website: [''],
      company: [''],
      occupation: [''],
      about: ['', Validators.maxLength(1000)],
      githubUrl: [''],
      linkedinUrl: [''],
      twitterUrl: [''],
      visibility: ['PUBLIC'],
      profilePictureUrl : [''],
      coverPictureUrl: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const userId = params.get('userId');
        console.log("Profile Component: userId", userId);
        
        if (userId && !isNaN(Number(userId))) {
          return this.profileService.getUserProfile(Number(userId)).pipe(
            tap(user => {
              this.profileService.currentUser$.pipe(
                take(1)
              ).subscribe(currentUser => {
                this.isCurrentUser = currentUser?.id === user.id;
              });
            })
          );
        } else {
          this.isCurrentUser = true;
          return this.profileService.currentUser$;
        }
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          if (this.isCurrentUser) {
            this.updateFormWithUserData(user);
          }
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
      }
    });
  }

  private updateFormWithUserData(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      company: user.company || '',
      occupation: user.occupation || '',
      about: user.about || '',
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || '',
      twitterUrl: user.twitterUrl || '',
      visibility: user.visibility || 'PUBLIC',
      profilePictureUrl: user.profilePictureUrl || '',
      coverPictureUrl: user.coverPictureUrl || ''
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

    getImageUrl(path : string | null | undefined): string {
    console.log(path)
    if (!path) {
      return 'assets/defalt.png'
    }
    console.log(path)
    return path;
  
  }

  // Update file upload methods
  onProfilePhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.uploadProfilePhoto(file);
    } else {
      this.snackBar.open('Please select a valid image file (JPG, PNG)', 'Close', { duration: 3000 });
    }
  }

  onCoverPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.uploadCoverPhoto(file);
    } else {
      this.snackBar.open('Please select a valid image file (JPG, PNG)', 'Close', { duration: 3000 });
    }
  }

  private uploadProfilePhoto(file: File): void {
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

  private uploadCoverPhoto(file: File): void {
    this.profileService.updateCoverPicture(file).subscribe({
      next: (user) => {
        this.user = user;
        this.snackBar.open('Cover photo updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error updating cover photo', 'Close', { duration: 3000 });
      }
    });
  }

  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }

}


