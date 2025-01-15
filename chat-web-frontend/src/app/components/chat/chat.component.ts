import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../../interface/room';
import { RoomService } from '../../services/room.service';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  imports: [MatFormField,MatIcon,CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  newMessage: string = '';
  roomId!: number;
  username: string = ''; // Get this from your auth service

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.roomId = +this.route.snapshot.params['id'];
    this.loadMessages();
  }

  loadMessages() {
    this.roomService.getRoomMessages(this.roomId).subscribe({
      next: (messages) => this.messages = messages,
      error: (error) => console.error('Error loading messages:', error)
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.roomService.sendMessage(this.roomId, this.newMessage, this.username).subscribe({
        next: () => {
          this.loadMessages();
          this.newMessage = '';
        },
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }

}
