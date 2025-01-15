import { Component, } from '@angular/core';
import { FormGroup,FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-room-create-dialog',
  imports: [NgIf,MatProgressSpinnerModule,MatDialogModule,MatError,MatHint,MatLabel,ReactiveFormsModule,MatFormField],
  templateUrl: './room-create-dialog.component.html',
  styleUrl: './room-create-dialog.component.css'
})
export class RoomCreateDialogComponent implements OnInit {
  roomForm !: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<RoomCreateDialogComponent>,
    private fb: FormBuilder,
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    private dialog : MatDialog,
    private router : Router
  ) {
  }
  
  ngOnInit() {
    this.roomForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid && !this.isLoading) {
      this.isLoading = true;
      const roomData = this.roomForm.value;
      
      this.roomService.createRoom(roomData.name).subscribe({
        next: (createdRoom) => {
          this.snackBar.open('Room created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.dialogRef.close(createdRoom);
        },
        error: (error) => {
          console.error('Error creating room:', error);
          this.snackBar.open('Failed to create room. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.roomForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least 3 characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} cannot exceed ${
        controlName === 'name' ? '50' : '200'
      } characters`;
    }
    return '';
  }

}
