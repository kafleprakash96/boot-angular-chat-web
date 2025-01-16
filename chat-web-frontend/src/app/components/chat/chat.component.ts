import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageReaction, Room } from '../../interface/room';
import { Message } from '../../interface/room';
import { RoomService } from '../../services/room.service';
import { WebsocketService } from '../../services/websocket.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../services/chat.service';

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
  reactionTypes: ('love' | 'like' | 'angry')[] = ['love', 'like', 'angry'];
  
  private messageSubscription?: Subscription;
  private reactionSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private chatService : ChatService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit() {
    const roomId = Number(this.route.snapshot.params['id']);
    this.loadRoom(roomId);
    this.loadMessages(roomId);
    
    // Subscribe to room-specific messages
  this.webSocketService.subscribeToRoom(roomId);
  this.messageSubscription = this.webSocketService.messages$.subscribe(message => {
    console.log('Received message in component:', message);
    // Check if message already exists to avoid duplicates
    if (!this.messages.some(m => m.id === message.id)) {
      this.messages.push(message);
      this.scrollToBottom();
    }
  });
  this.reactionSubscription = this.webSocketService.reactions$.subscribe(event => {
    const message = this.messages.find(m => m.id === event.messageId);
    console.log("In reaction subscription")
    if (message) {
      if (event.eventType === 'REACTION_ADDED') {
        // Remove existing reaction from same user if exists
        message.reactions = message.reactions.filter(r => r.user !== event.username);
        // Add new reaction
        message.reactions.push({
          type: event.reactionType,
          user: event.username
        });
      } else if (event.eventType === 'REACTION_REMOVED') {
        message.reactions = message.reactions.filter(r => r.user !== event.username);
      }
    }
  });
}

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
    this.reactionSubscription?.unsubscribe();
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


  addReaction(message: Message, reactionType: string) {
    const reaction = {
      type: reactionType,
      user: this.currentUser
    };

    this.chatService.addReaction(message.id, reaction).subscribe({
      error: (error) => console.error('Error adding reaction:', error)
    });
  }

  removeReaction(messageId: number) {
    this.chatService.removeReaction(messageId, this.currentUser).subscribe({
      error: (error) => console.error('Error removing reaction:', error)
    });
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
  getReactionEmoji(type: string): string {
    switch (type) {
      case 'love': return '❤️';
      case 'like': return '👍';
      case 'angry': return '😠';
      default: return '';
    }
  }

  groupReactions(reactions: MessageReaction[]) {
    const groups = reactions.reduce((acc, reaction) => {
      const existing = acc.find(g => g.type === reaction.type);
      if (existing) {
        existing.users.push(reaction.user);
        existing.count++;
      } else {
        acc.push({ type: reaction.type, users: [reaction.user], count: 1 });
      }
      return acc;
    }, [] as Array<{ type: string, users: string[], count: number }>);
    
    return groups;
  }

  getReactionTooltip(reaction: { type: string, users: string[] }): string {
    return `${reaction.users.join(', ')} reacted with ${reaction.type}`;
  }

  showReactions(message: Message) {
    message.showActions = true;
    message.showReactions = true;
  }

  hideReactions(message: Message) {
    message.showActions = false;
    message.showReactions = false;
  }
}