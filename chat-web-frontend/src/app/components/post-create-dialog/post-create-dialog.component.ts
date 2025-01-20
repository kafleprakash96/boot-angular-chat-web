import { Component, isStandalone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostService } from '../../services/post.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-create-dialog',
  imports: [MatCardModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSidenavModule,MatToolbarModule,MatButtonModule,MatIconModule,MatMenuModule,ReactiveFormsModule,MatDialogModule],
  templateUrl: './post-create-dialog.component.html',
  styleUrl: './post-create-dialog.component.css'
})
export class PostCreateDialogComponent {

  postForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialogRef: MatDialogRef<PostCreateDialogComponent>
  ) {
    this.postForm = this.fb.group({
      title:[''],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.isLoading = true;
      const content = this.postForm.get('content')?.value;
      this.postService.createPost({content}).subscribe({
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

  onCancel() {
    this.dialogRef.close();
  }

}
