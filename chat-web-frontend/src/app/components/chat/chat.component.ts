import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Subscription } from 'rxjs'
import { MessageReaction, Room } from '../../interface/room'
import { Message } from '../../interface/room'
import { RoomService } from '../../services/room.service'
import { WebsocketService } from '../../services/websocket.service'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { ChatService } from '../../services/chat.service'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-chat',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef

  room!: Room
  messages: Message[] = []
  messageInput = new FormControl('')
  currentUser = localStorage.getItem('username') || ''
  replyToMessage: Message | null = null
  reactionTypes: ('love' | 'like' | 'angry')[] = ['love', 'like', 'angry']

  private messageSubscription?: Subscription
  private reactionSubscription?: Subscription

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private chatService: ChatService,
    private webSocketService: WebsocketService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const roomId = Number(this.route.snapshot.params['id'])
    this.loadRoom(roomId)
    this.loadMessages(roomId)

    // Subscribe to room-specific messages
    this.webSocketService.subscribeToRoom(roomId)
    this.messageSubscription = this.webSocketService.messages$.subscribe(
      (message) => {
        console.log('Received message in component:', message)
        // Check if message already exists to avoid duplicates
        if (!this.messages.some((m) => m.id === message.id)) {
          this.messages.push(message)
          this.scrollToBottom()
        }
      },
    )
    this.reactionSubscription = this.webSocketService.reactions$.subscribe(
      (event) => {
        const message = this.messages.find((m) => m.id === event.messageId)
        console.log('In reaction subscription')
        if (message) {
          if (event.eventType === 'REACTION_ADDED') {
            // Remove existing reaction from same user if exists
            message.reactions = message.reactions.filter(
              (r) => r.user !== event.username,
            )
            // Add new reaction
            message.reactions.push({
              type: event.reactionType,
              user: event.username,
            })
          } else if (event.eventType === 'REACTION_REMOVED') {
            message.reactions = message.reactions.filter(
              (r) => r.user !== event.username,
            )
          }
        }
      },
    )
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe()
    this.reactionSubscription?.unsubscribe()
    this.webSocketService.disconnect()
  }

  private loadRoom(roomId: number) {
    this.roomService.getRoom(roomId).subscribe((room) => {
      this.room = room
    })
  }

  private loadMessages(roomId: number) {
    this.roomService.getRoomMessages(roomId).subscribe((messages) => {
      this.messages = messages
      this.scrollToBottom()
    })
  }

  sendMessage() {
    if (this.messageInput.value?.trim() && this.room) {
      const message = {
        content: this.messageInput.value,
        sender: this.currentUser || this.authService.currentUser,
        replyToId: this.replyToMessage?.id,
        roomId: this.room.id,
      }

      // Save to database via HTTP
      this.roomService.sendMessage(this.room.id, message).subscribe({
        next: (savedMessage) => {
          console.log('Message saved:', savedMessage)
          this.messageInput.reset()
          this.replyToMessage = null
        },
        error: (error) => {
          console.error('Error sending message:', error)
        },
      })
    }
  }

  addReaction(message: Message, reactionType: string) {
    const existingReaction = message.reactions.find(
      (r) => r.user === this.currentUser && r.type === reactionType,
    )
    if (existingReaction) {
      // If the user has already reacted with this type, remove the reaction
      this.removeReaction(message.id, reactionType)
    } else {
      // Otherwise, add the reaction
      const reaction = {
        type: reactionType,
        user: this.currentUser,
      }
      this.chatService.addReaction(message.id, reaction).subscribe({
        error: (error) => console.error('Error adding reaction:', error),
      })
    }
  }

  removeReaction(messageId: number, reactionType: string) {
    this.chatService
      .removeReaction(messageId, this.currentUser, reactionType)
      .subscribe({
        next: () => {
          console.log('Reaction removed')
        },
        error: (error) => console.error('Error removing reaction:', error),
      })
  }

  setReplyTo(message: Message) {
    this.replyToMessage = message
  }

  cancelReply() {
    this.replyToMessage = null
  }

  private scrollToBottom() {
    setTimeout(() => {
      const element = this.messageContainer.nativeElement
      element.scrollTop = element.scrollHeight
    })
  }

  isOwnMessage(message: Message): boolean {
    // Get the current user from localStorage
    const currentUser = localStorage.getItem('username') || ''
    console.log('Message alignment check:', {
      currentUser,
      messageSender: message.sender,
      isOwn: message.sender === currentUser,
    })
    return message.sender === currentUser
  }

  findReplyMessage(replyToId: number): Message | undefined {
    return this.messages.find((m) => m.id === replyToId)
  }
  getReactionEmoji(type: string): string {
    switch (type) {
      case 'love':
        return '❤️'
      case 'like':
        return '👍'
      case 'angry':
        return '😠'
      default:
        return ''
    }
  }

  groupReactions(reactions: MessageReaction[]) {
    // Group reactions by type and count the occurrences
    const groups = reactions.reduce((acc, reaction) => {
      const existing = acc.find((g) => g.type === reaction.type)
      if (existing) {
        existing.users.push(reaction.user)
        existing.count++
      } else {
        acc.push({ type: reaction.type, users: [reaction.user], count: 1 })
      }
      return acc
    }, [] as Array<{ type: string; users: string[]; count: number }>)

    return groups
  }

  getReactionTooltip(reaction: { type: string; users: string[] }): string {
    return `${reaction.users.join(', ')} reacted with ${reaction.type}`
  }

  showReactions(message: Message) {
    message.showActions = true
    message.showReactions = true
  }

  hideReactions(message: Message) {
    message.showActions = false
    message.showReactions = false
  }

  markMessageAsSeen(message: Message) {
    if (!this.isOwnMessage(message) && !message.seen) {
      this.chatService.markMessageAsSeen(message.id).subscribe()
    }
  }

  // Add helper methods
  shouldShowSender(message: Message, index: number): boolean {
    if (index === 0) return true

    // Show sender name if either:
    // 1. Previous message was from a different sender
    // 2. There's been a significant time gap (e.g., 5 minutes)
    const prevMessage = this.messages[index - 1]
    const timeGap = 5 * 60 * 1000 // 5 minutes in milliseconds

    return (
      prevMessage.sender !== message.sender ||
      new Date(message.timestamp).getTime() -
        new Date(prevMessage.timestamp).getTime() >
        timeGap
    )
  }

  formatSenderName(sender: string): string {
    // If it's the current user, return 'You'
    return sender === this.currentUser ? 'You' : sender
  }

  getMessageAlignment(message: Message): string {
    return this.isOwnMessage(message) ? 'own-messages' : 'other-messages'
  }

  getMessageTime(message: Message): string {
    return new Date(message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  getUserReaction(message: Message): MessageReaction | undefined {
    return message.reactions.find((r) => r.user === this.currentUser)
  }
}
