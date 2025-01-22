import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter,OnInit } from '@angular/core';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [CommonModule,UserDialogComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  @Input() user:any;
  @Output() sendRequest = new EventEmitter<number>();
  @Output() viewProfile = new EventEmitter<number>();
  isOnline = false;

  showDialog = false;
  private subscription!: Subscription;

  constructor(private websocketService: WebsocketService){}

  ngOnInit() {
    console.log('User Component Initialized');
    this.isOnline = this.websocketService.isUserOnline(this.user.id);
    console.log('User', this.user.id, 'is online:', this.isOnline);

    // Subscribing to user status updates
    this.subscription = this.websocketService.userStatus$.subscribe(userStatusMap => {
        console.log('User status map received in component:', userStatusMap);
        if (userStatusMap) {
            const userStatus = userStatusMap.get(this.user.id);
            console.log('User status for', this.user.id, ':', userStatus);
            this.isOnline = userStatus !== undefined ? userStatus : false;
        }
    });
}


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

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
}
