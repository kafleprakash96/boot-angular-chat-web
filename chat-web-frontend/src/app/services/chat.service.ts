import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message,MessageReaction,MessageReactionEvent } from '../interface/room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatApiUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http: HttpClient) {}

  getRoomMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.chatApiUrl}/room/${roomId}`);
  }

  sendMessage(roomId: number, message: {
    content: string,
    sender: string,
    replyToId?: number
  }): Observable<Message> {
    return this.http.post<Message>(`${this.chatApiUrl}/room/${roomId}/send`, message);
  }

  //Todo

  markAsSeen(messageId: number, username: string): Observable<any> {
    const params = { username };
    return this.http.post(`${this.chatApiUrl}/message/${messageId}/seen`, null, { params });
  }

  addReaction(messageId: number, reaction: {
    type: string,
    user: string
  }): Observable<MessageReaction> {
    return this.http.post<MessageReaction>(
      `${this.chatApiUrl}/message/${messageId}/reactions`,
      reaction
    );
  }

  removeReaction(messageId: number, username: string): Observable<void> {
    return this.http.delete<void>(
      `${this.chatApiUrl}/message/${messageId}/reactions/${username}`
    );
  }
}
