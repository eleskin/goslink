import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private userStore = inject(UserStore);

  constructor() {
    const {_id} = this.userStore.user();
    const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

    const webSocket = new WebSocketChatClient(webSocketUrl);
  }
}
