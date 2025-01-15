import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private serverUrl: string = 'http://localhost:8080/ws';  // Note: Using http instead of ws

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),  // Use SockJS
      connectHeaders: {
        Authorization: `Bearer ${this.getToken()}`
      },
      debug: (str) => {
        console.log("At websocket debug");
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      // Subscribe to topics here
      this.client.subscribe('/topic/messages', message => {
        console.log('Received: ' + message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
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