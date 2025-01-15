import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AuthResponse} from '../interface/authresponse';
import {Room,Message} from '../interface/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {


  private baseUrl = 'http://localhost:8080/api/v1/rooms';

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<any> {
  

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get(this.baseUrl, { headers });
  }

  createRoom(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, null, {
      params: { name }
    });
  }

  getRoomMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/chat/room/${roomId}`);
  }

  sendMessage(roomId: number, content: string, sender: string): Observable<any> {
    const params = { content, sender };
    return this.http.post(`${this.baseUrl}/chat/room/${roomId}/send`, null, { params });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
