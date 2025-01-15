import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Room } from '../../interface/room';
import { Message } from '../../interface/room';
import { RoomService } from '../../services/room.service';
import { WebsocketService } from '../../services/websocket.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chat',
  imports: [MatIconModule,ReactiveFormsModule,MatFormFieldModule,MatCardModule,CommonModule,
    MatButtonModule,
    MatInputModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  room!: Room;
  messages: Message[] = [];
  messageInput = new FormControl('');
  currentUser = localStorage.getItem('username') || '';
  replyToMessage: Message | null = null;
  
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit() {
    const roomId = Number(this.route.snapshot.params['id']);
    this.loadRoom(roomId);
    this.loadMessages(roomId);
    
    // Subscribe to room-specific messages
  this.webSocketService.subscribeToRoom(roomId);
  this.subscription = this.webSocketService.messages$.subscribe(message => {
    console.log('Received message in component:', message);
    // Check if message already exists to avoid duplicates
    if (!this.messages.some(m => m.id === message.id)) {
      this.messages.push(message);
      this.scrollToBottom();
    }
  });
}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }


  private loadRoom(roomId: number) {
    this.roomService.getRoom(roomId).subscribe(room => {
      this.room = room;
    });
  }

  private loadMessages(roomId: number) {
    this.roomService.getRoomMessages(roomId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (this.messageInput.value?.trim() && this.room) {
      const message = {
        content: this.messageInput.value,
        sender: this.currentUser,
        replyToId: this.replyToMessage?.id,
        roomId: this.room.id
      };
  
      // Save to database via HTTP
      this.roomService.sendMessage(this.room.id, message).subscribe({
        next: (savedMessage) => {
          console.log('Message saved:', savedMessage);
          this.messageInput.reset();
          this.replyToMessage = null;
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }
  

  setReplyTo(message: Message) {
    this.replyToMessage = message;
  }

  cancelReply() {
    this.replyToMessage = null;
  }

  private scrollToBottom() {
    setTimeout(() => {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }

  isOwnMessage(message: Message): boolean {
    return message.sender === this.currentUser;
  }

  findReplyMessage(replyToId: number): Message | undefined {
    return this.messages.find(m => m.id === replyToId);
  }
}