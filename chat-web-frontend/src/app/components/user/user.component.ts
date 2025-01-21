import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter } from '@angular/core';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user',
  imports: [CommonModule,UserDialogComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  @Input() user:any;
  @Output() sendRequest = new EventEmitter<number>();
  @Output() viewProfile = new EventEmitter<number>();

  showDialog = false;

  onMouseEnter() {
    this.showDialog = true;
  }

  onMouseLeave() {
    this.showDialog = false;
  }
  
  onSendRequest() {
    this.sendRequest.emit(this.user.id);
  }

  onViewProfile() {
    this.viewProfile.emit(this.user.id);
  }

  onClick(): void {
    this.viewProfile.emit(this.user.id);
  }
}
