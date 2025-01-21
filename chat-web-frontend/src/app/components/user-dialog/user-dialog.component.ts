import { Component, Input, Output,EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-dialog',
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {

  @Input() user:any;
  @Output() sendRequest = new EventEmitter<number>();
  @Output() viewProfile = new EventEmitter<number>();

  onSendRequest(): void {
    this.sendRequest.emit(this.user.id);  
  }

  // Emit the userId when viewing a profile
  onViewProfile(): void {
    this.viewProfile.emit(this.user.id);  
  }

}
