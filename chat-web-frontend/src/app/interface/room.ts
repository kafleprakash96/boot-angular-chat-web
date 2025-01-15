export interface Room {
    id: number;
  name: string;
  createdBy: string;
  messages?: Message[];
}

export interface Message {
    id: number;
    content: string;
    sender: string;
    timestamp: Date;
    seen: boolean;
  }
