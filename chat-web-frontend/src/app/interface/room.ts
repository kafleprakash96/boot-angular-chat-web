export interface Room {
    id: number;
  name: string;
  createdBy: string;
  messages?: Message[];
  participants: string[];
}

export interface Message {

    seen: boolean;
    id: number;
  content: string;
  sender: string;
  timestamp: Date;
  chatRoomId: number;
  consumed: boolean;
  seenby: string[];
  replyToId?: number;
  reactions: MessageReaction[];
  showActions?: boolean;
  showReactions?: boolean;
  }

  export interface MessageReaction {
    type: string;
    user: string;
  }

  export interface MessageReactionEvent {
    messageId: number;
    roomId: number;
    username: string;
    reactionType: string;
    eventType: 'REACTION_ADDED' | 'REACTION_REMOVED';
  }
  
