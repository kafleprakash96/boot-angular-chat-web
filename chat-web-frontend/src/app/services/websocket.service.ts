import { Injectable } from '@angular/core'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { BehaviorSubject, Subject } from 'rxjs'
import { Message, MessageReactionEvent } from '../interface/room'

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client
  private serverUrl: string = 'http://localhost:8080/ws'
  private messageSubject = new Subject<Message>()
  public messages$ = this.messageSubject.asObservable()
  private userStatusSubject = new BehaviorSubject<Map<number, boolean>>(
    new Map(),
  )
  public userStatus$ = this.userStatusSubject.asObservable()

  private reactionSubject = new Subject<MessageReactionEvent>()
  reactions$ = this.reactionSubject.asObservable()

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      connectHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      debug: (str) => {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to websocket')
        // Request initial user status list
        this.requestInitialUserStatus()
        this.subscribeToUserStatus()
        this.updateUserStatus(true)
        console.log('User status updated')
      },
      onDisconnect: () => {
        console.log('Disconnected from websocket')
        this.updateUserStatus(false)
      },
    })

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    }

    this.client.activate()
  }

  subscribeToRoom(roomId: number) {
    if (this.client.connected) {
      console.log(`Subscribing to room ${roomId}`)
      this.client.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log('Received message:', message.body)
        const messageData: Message = JSON.parse(message.body)
        this.messageSubject.next(messageData)
      })

      this.client.subscribe(`/topic/room/${roomId}/reactions`, (event) => {
        const reactionEvent = JSON.parse(event.body)
        this.reactionSubject.next(reactionEvent)
      })
    } else {
      this.client.onConnect = () => {
        console.log(`Subscribing to room ${roomId} after connect`)
        this.client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log('Received message:', message.body)
          const messageData: Message = JSON.parse(message.body)
          this.messageSubject.next(messageData)
        })
      }
    }
  }

  sendMessage(message: any) {
    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
    })
  }

  disconnect() {
    this.client.deactivate()
  }

  private getToken(): string {
    return localStorage.getItem('token') || ''
  }

  requestInitialUserStatus() {
    if (this.client.connected) {
      console.log('Requesting initial user status')
      this.client.publish({
        destination: '/app/user.status.initial',
        body: JSON.stringify({}),
      })
    }
  }

  subscribeToUserStatus() {
    console.log('Subscribing to user status')
    if (this.client.connected) {
      // Subscribe to user status updates
      this.client.subscribe('/topic/user-status', (message) => {
        const userStatusData = JSON.parse(message.body)
        console.log('Parsed message body:', userStatusData)
        const userStatusMap = this.userStatusSubject.getValue();

        console.log('Before updating userStatusMap:', userStatusMap)

        const newMap = new Map(userStatusMap);

        if (userStatusData.online) {
          newMap.set(userStatusData.userId, true);
      } else {
          newMap.delete(userStatusData.userId);
      }
      console.log('Updated status map:', Array.from(newMap.entries()));
      this.userStatusSubject.next(newMap);
      })

      //subscribe to initial user status list
      this.client.subscribe('/topic/user-status-initial', (message) => {  
        const initialStatus = JSON.parse(message.body);
        const newStatusMap = new Map<number, boolean>();

        //update map with all user statuses
        Object.entries(initialStatus).forEach(([userId, status]) => {
          console.log('Processing user:', userId, 'status:', status);

          newStatusMap.set(Number(userId), status as boolean);
        });
        this.userStatusSubject.next(newStatusMap);
      })
    }
  }

  updateUserStatusMap(userId: number, online: boolean) {
    const currentMap = this.userStatusSubject.getValue()
    const newMap = new Map(currentMap)
    newMap.set(userId, online)
    this.userStatusSubject.next(newMap)
  }

  updateUserStatus(status: boolean) {
    console.log('Websocket connection state', this.client.connected)
    if (this.client.connected) {
      console.log('Updating user status', status)
      this.client.publish({
        destination: '/app/user.status',
        body: JSON.stringify({ online: status }),
      })
    } else {
      console.error('Cannot update user status, not connected to websocket')
    }
  }

  //Method to check if user is online
  isUserOnline(userId: number): boolean {
    const userStatusMap = this.userStatusSubject.getValue()
    console.log('Is user online', userStatusMap)
    return userStatusMap.get(userId) || false
  }
}
