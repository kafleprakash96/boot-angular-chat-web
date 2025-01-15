export interface Room {
    id: number;
  name: string;
  createdBy: string;
  messages?: Message[];
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
  }
