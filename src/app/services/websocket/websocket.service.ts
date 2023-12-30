import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket;
  private readonly userStore = inject(UserStore);
  private readonly messagesStore = inject(MessagesStore);

  constructor() {
    const {_id} = this.userStore.user();
    const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

    this.webSocket = new WebSocketChatClient(webSocketUrl);

    this.getMessagesEventListeners();
  }


  private getMessagesEventListeners() {
    // this.webSocket.addEventListener('NEW_MESSAGE', (event) => {
    // });
    this.webSocket.addEventListener('GET_MESSAGES', (event: any) => {
      console.log(event);
      this.messagesStore.setMessages(event.detail.data.messages);
    });
    // this.webSocket.addEventListener('UPDATE_MESSAGE', (event) => {
    // });
    // this.webSocket.addEventListener('DELETE_MESSAGES', (event) => {
    // });
  }
}
