import {effect, inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';
import WebsocketStore from '../../store/websocket/websocket.store';
import RoomsStore from '../../store/rooms/rooms.store';
import ChatStore from '../../store/chat/chat.store';

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
      console.log(event)
      this.webSocketStore.setContact(event.detail.data.user);
      this.webSocketStore.setMessages(event.detail.data.messages);
    });
    this.webSocket?.addEventListener('NEW_MESSAGE', (event: any) => {
      this.webSocketStore.setMessages([...this.webSocketStore.messages(), event.detail.data.message]);
    });
  }
}
