import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../interface/room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http: HttpClient) {}

  getRoomMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/room/${roomId}`);
  }

  sendMessage(roomId: number, content: string, sender: string): Observable<any> {
    const params = { content, sender };
    return this.http.post(`${this.apiUrl}/room/${roomId}/send`, null, { params });
  }

  markAsSeen(messageId: number, username: string): Observable<any> {
    const params = { username };
    return this.http.post(`${this.apiUrl}/message/${messageId}/seen`, null, { params });
  }
}
