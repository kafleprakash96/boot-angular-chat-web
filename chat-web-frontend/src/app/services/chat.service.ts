import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message,MessageReaction,MessageReactionEvent } from '../interface/room';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatApiUrl = 'http://localhost:8080/api/v1/chat';
  private messageReactionApiUrl = 'http://localhost:8080/api/v1/messages'

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


  markMessageAsSeen(messageId: number) {
    return this.http.post(`${this.chatApiUrl}/messages/${messageId}/seen`, {});
  }

  addReaction(messageId: number, reaction: {
    type: string,
    user: string
  }): Observable<MessageReaction> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.post<MessageReaction>(
      `${this.messageReactionApiUrl}/${messageId}/reactions`,
      reaction, {headers}
    );
  }

  removeReaction(messageId: number, username: string, reactionType: string): Observable<void> {
    return this.http.delete<void>(
      `${this.chatApiUrl}/message/${messageId}/reactions/${username}`, {
        body : {username,reactionType}
      }
    );
  }

  private getToken(): string {
    const token = localStorage.getItem('token') || '';
    console.log("Fetched token",token)
  if (!token) {
    console.error('Token not found in localStorage');
  }
  return token;
  }
}
