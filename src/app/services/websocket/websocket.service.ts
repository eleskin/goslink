import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import WebsocketStore from '../../store/websocket/websocket.store';
import Message from '../../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly webSocketStore = inject(WebsocketStore);

  public setHandlers() {
    this.webSocket?.addEventListener('SEARCH_USER', (event: any) => {
      this.webSocketStore.setSearchedUser(event.detail.data.user);
    });
    this.webSocket?.addEventListener('GET_USER', (event: any) => {
      this.webSocketStore.setContact(event.detail.data.user);
      this.webSocketStore.setMessages(event.detail.data.messages);
    });
    this.webSocket?.addEventListener('NEW_MESSAGE', (event: any) => {
      this.webSocketStore.setMessages([...this.webSocketStore.messages(), event.detail.data.message]);
    });
    this.webSocket?.addEventListener('DELETE_MESSAGE', (event: any) => {
      this.webSocketStore.setMessages(this.webSocketStore.messages().filter((message: Message) => {
        return message._id !== event.detail.data.messageId;
      }));
    });
    this.webSocket?.addEventListener('GET_ROOM', (event: any) => {
      this.webSocketStore.setRooms(event.detail.data.rooms);
    });
  }
}
