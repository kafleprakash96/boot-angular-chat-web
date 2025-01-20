import { Component } from '@angular/core';
import { Post } from '../../interface/post';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-post-card',
  imports: [FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSidenavModule,MatToolbarModule,MatButtonModule,MatIconModule,MatMenuModule,ReactiveFormsModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {

  @Input() post!: Post;
  @Output() like = new EventEmitter<string>();
  @Output() comment = new EventEmitter<{postId: string, content: string}>();
  @Output() reply = new EventEmitter<{commentId: string, content: string}>();

  commentContent = new FormControl('');
  replyContent = new FormControl('');
  showComments = false;
  replyingToComment: string | null = null;

  onLike() {
    this.like.emit(this.post.id);
  }

  onComment() {
    if (this.commentContent.value?.trim()) {
      this.comment.emit({
        postId: this.post.id,
        content: this.commentContent.value
      });
      this.commentContent.reset();
    }
  }

  onReply(commentId: string) {
    if (this.replyContent.value?.trim()) {
      this.reply.emit({
        commentId: commentId,
        content: this.replyContent.value
      });
      this.replyContent.reset();
      this.replyingToComment = null;
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  startReply(commentId: string) {
    this.replyingToComment = commentId;
  }

  cancelReply() {
    this.replyingToComment = null;
    this.replyContent.reset();
  }

}
