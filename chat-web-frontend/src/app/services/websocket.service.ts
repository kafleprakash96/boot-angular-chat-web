import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Message,MessageReactionEvent } from '../interface/room';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private serverUrl: string = 'http://localhost:8080/ws';
  private messageSubject = new Subject<Message>();
  public messages$ = this.messageSubject.asObservable();

  private reactionSubject = new Subject<MessageReactionEvent>();
  reactions$ = this.reactionSubject.asObservable();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      connectHeaders: {
        Authorization: `Bearer ${this.getToken()}`
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  subscribeToRoom(roomId: number) {
    if (this.client.connected) {
      console.log(`Subscribing to room ${roomId}`);
      this.client.subscribe(`/topic/room/${roomId}`, message => {
        console.log('Received message:', message.body);
        const messageData: Message = JSON.parse(message.body);
        this.messageSubject.next(messageData);
      });

      this.client.subscribe(`/topic/room/${roomId}/reactions`, (event) => {
        const reactionEvent = JSON.parse(event.body);
        this.reactionSubject.next(reactionEvent);
      });
    } else {
      this.client.onConnect = () => {
        console.log(`Subscribing to room ${roomId} after connect`);
        this.client.subscribe(`/topic/room/${roomId}`, message => {
          console.log('Received message:', message.body);
          const messageData: Message = JSON.parse(message.body);
          this.messageSubject.next(messageData);
        });
      }
    }
  }

  sendMessage(message: any) {
    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
  }

  disconnect() {
    this.client.deactivate();
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}