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
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-create-dialog',
  imports: [NgIf,
    MatProgressSpinnerModule,MatDialogModule,MatError,MatInputModule,MatLabel,ReactiveFormsModule,MatFormField,MatButtonModule],
  templateUrl: './room-create-dialog.component.html',
  styleUrl: './room-create-dialog.component.css'
})
export class RoomCreateDialogComponent{
  roomForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<RoomCreateDialogComponent>,
    private fb: FormBuilder,
    private roomService: RoomService
  ) {
    this.roomForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      this.isLoading = true;
      const roomName = this.roomForm.get('roomName')?.value;
      
      this.roomService.createRoom(roomName).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating room:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
