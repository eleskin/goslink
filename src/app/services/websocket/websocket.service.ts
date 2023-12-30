import {effect, inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';
import {ActivatedRoute} from '@angular/router';
import RoomsStore from '../../store/rooms/rooms.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly userStore = inject(UserStore);
  private readonly messagesStore = inject(MessagesStore);
  private roomsStore = inject(RoomsStore);

  constructor(private route: ActivatedRoute) {
    effect(() => {
      const {_id} = this.userStore.user();
      const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

      this.webSocket = new WebSocketChatClient(webSocketUrl);
      this.getMessagesEventListeners();

    });
  }

  private getMessagesEventListeners() {
    // this.webSocket.addEventListener('NEW_MESSAGE', (event) => {
    // });
    this.webSocket?.addEventListener('GET_MESSAGES', (event: any) => {
      this.messagesStore.setMessages(event.detail.data.messages);
    });
    // this.webSocket.addEventListener('UPDATE_MESSAGE', (event) => {
    // });
    // this.webSocket.addEventListener('DELETE_MESSAGES', (event) => {
    // });
  }
}
