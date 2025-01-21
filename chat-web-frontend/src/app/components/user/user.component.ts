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

  onMouseEnter(event: MouseEvent) {
    this.showDialog = true;
    // Wait for dialog to be rendered
    setTimeout(() => {
      const dialog = document.querySelector('.user-dialog') as HTMLElement;
      const userElement = event.currentTarget as HTMLElement;
      const rect = userElement.getBoundingClientRect();
      
      // Position the dialog to the right of the user element
      dialog.style.top = `${rect.top}px`;
      dialog.style.left = `${rect.right + 10}px`; // 10px gap
      
      // Check if dialog goes off-screen to the right
      const dialogRect = dialog.getBoundingClientRect();
      if (dialogRect.right > window.innerWidth) {
        // Position to the left instead
        dialog.style.left = `${rect.left - dialogRect.width - 10}px`;
      }
    });
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
