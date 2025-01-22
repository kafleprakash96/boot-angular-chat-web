import { CommonModule } from '@angular/common'
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { UserDialogComponent } from '../user-dialog/user-dialog.component'
import { WebsocketService } from '../../services/websocket.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-user',
  imports: [CommonModule, UserDialogComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  @Input() user: any
  @Output() sendRequest = new EventEmitter<number>()
  @Output() viewProfile = new EventEmitter<number>()
  isOnline = false

  showDialog = false
  private subscription!: Subscription

  @ViewChild('userDialog') dialog!: ElementRef

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    console.log('User Component Initialized')
    this.isOnline = this.websocketService.isUserOnline(this.user.id)
    console.log('User', this.user.id, 'is online:', this.isOnline)

    // Subscribing to user status updates
    this.subscription = this.websocketService.userStatus$.subscribe(
      (userStatusMap) => {
        console.log('User status map received in component:', userStatusMap)
        if (userStatusMap) {
          const userStatus = userStatusMap.get(this.user.id)
          console.log('User status for', this.user.id, ':', userStatus)
          this.isOnline = userStatus !== undefined ? userStatus : false
        }
      },
    )
  }

  onMouseEnter(event: MouseEvent) {
    const userElement = event.currentTarget as HTMLElement;
    if (!userElement) return;
  
    this.showDialog = true;
  
    // Ensure the dialog is rendered before positioning
    setTimeout(() => {
      const dialogElement = document.querySelector('.user-dialog') as HTMLElement;
      if (!dialogElement) return;
  
      const rect = userElement.getBoundingClientRect();
  
      // Position the dialog to the left of the user component
      dialogElement.style.top = `${rect.top}px`;
      dialogElement.style.left = `${rect.left - dialogElement.offsetWidth - 10}px`; // Left with 10px gap
  
      // Ensure the dialog doesn't overflow the viewport on the left
      const dialogRect = dialogElement.getBoundingClientRect();
      if (dialogRect.left < 0) {
        // If it goes off-screen, position it to the right instead
        dialogElement.style.left = `${rect.right + 10}px`;
      }
    });
  }
  
  onMouseLeave() {
    setTimeout(() => {
      this.showDialog = false;
    }, 200);
  }
  
  

  keepDialogVisible(){
    this.showDialog = true;
  }

  onSendRequest() {
    this.sendRequest.emit(this.user.id)
  }

  onViewProfile() {
    this.viewProfile.emit(this.user.id)
  }

  onClick(): void {
    this.viewProfile.emit(this.user.id)
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
