import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private webSocket = new WebSocket('ws://localhost:8000/api/websocket');
  private readonly userStore = inject(UserStore);

  constructor() {
    const {_id} = this.userStore.user();
    const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

    this.webSocket = new WebSocketChatClient(webSocketUrl);

    this.getMessagesEventListeners();
  }


  private getMessagesEventListeners() {
    this.webSocket.addEventListener('NEW_MESSAGE', (event) => {

    });
    this.webSocket.addEventListener('GET_MESSAGES', (event) => {

    });
    this.webSocket.addEventListener('UPDATE_MESSAGE', (event) => {

    });
    this.webSocket.addEventListener('DELETE_MESSAGES', (event) => {

    });
  }
}
