import {effect, inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';
import WebsocketStore from '../../store/websocket/websocket.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly userStore = inject(UserStore);
  private readonly messagesStore = inject(MessagesStore);
  private readonly webSocketStore = inject(WebsocketStore);

  constructor() {
    const {_id} = this.userStore.user();
    const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

    this.webSocket = new WebSocketChatClient(webSocketUrl, this.webSocketStore);

    effect(() => {
      this.getMessagesEventListeners();
    });
  }

  private getMessagesEventListeners() {

    if (this.webSocketStore.readyState() === 1) {
      this.webSocket?.addEventListener('NEW_MESSAGE', (event: any) => {
        this.messagesStore.setMessages([...this.messagesStore.messages(), event.detail.data.message]);
      });

      this.webSocket?.addEventListener('GET_MESSAGE', (event: any) => {
        this.messagesStore.setMessages(event.detail.data.messages);
      });

      // this.webSocket?.addEventListener('UPDATE_MESSAGE', (event: any) => {
      // });

      this.webSocket?.addEventListener('DELETE_MESSAGE', (event: any) => {
        console.log(event.detail.data.message);
        this.messagesStore.setMessages(
          [...this.messagesStore.messages().filter((message) => message._id !== event.detail.data.message)],
        );
      });
    }
  }
}
