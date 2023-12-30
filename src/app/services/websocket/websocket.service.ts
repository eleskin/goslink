import {inject, Injectable} from '@angular/core';
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
  private readonly userStore = inject(UserStore);
  private readonly chatStore = inject(ChatStore);
  private readonly messagesStore = inject(MessagesStore);
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly roomsStore = inject(RoomsStore);

  constructor() {
    const {_id} = this.userStore.user();
    const webSocketUrl = `ws://localhost:8000/api/websocket/?_id=${_id}`;

    this.webSocket = new WebSocketChatClient(webSocketUrl, this.webSocketStore);

    this.getMessagesEventListeners(this.webSocket);
  }

  private getMessagesEventListeners(websocket: WebSocket) {
    websocket.addEventListener('NEW_MESSAGE', (event: any) => {
      this.messagesStore.setMessages([...this.messagesStore.messages(), event.detail.data.message]);
    });

    websocket.addEventListener('GET_MESSAGE', (event: any) => {
      this.messagesStore.setMessages(event.detail.data.messages);
      this.chatStore.setConversationalist(event.detail.data.user);
    });

    // websocket.addEventListener('UPDATE_MESSAGE', (event: any) => {
    // });

    websocket.addEventListener('DELETE_MESSAGE', (event: any) => {
      this.messagesStore.setMessages(
        [...this.messagesStore.messages().filter((message) => message._id !== event.detail.data.message)],
      );
    });


    websocket.addEventListener('GET_ROOMS', (event: any) => {
      this.roomsStore.setRooms(event.detail.data.rooms);
    });


    websocket.addEventListener('GET_USER', (event: any) => {
      this.chatStore.setConversationalist(event.detail.data.user);
    });
  }
}
