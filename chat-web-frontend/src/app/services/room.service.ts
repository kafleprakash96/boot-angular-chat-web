import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, Message } from '../interface/room';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseRoomUrl = 'http://localhost:8080/api/v1/rooms';
  private baseChatUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http: HttpClient) {}

  // Get all rooms
  getAllRooms(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get(this.baseRoomUrl, { headers });
  }

  // Create a new room
  createRoom(name: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.post(
      `${this.baseRoomUrl}/create`,
      null,
      {
        params: { name },
        headers: headers,
      }
    );
  }

  getRoomMessages(roomId: number): Observable<Message[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get<Message[]>(
      `${this.baseRoomUrl}/${roomId}/messages`,
      { headers }
    );
  }

  // Send a message to a specific room
  sendMessage(roomId: number, content: string, sender: string, replyToId?: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    const body = { content, sender, replyToId };
    return this.http.post(
      `${this.baseChatUrl}/room/${roomId}/send`,
      body,
      { headers }
    );
  }

  // Get details of a specific room
  getRoom(roomId: number): Observable<Room> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get<Room>(`${this.baseRoomUrl}/${roomId}`, { headers });
  }

  // Retrieve the token from localStorage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
