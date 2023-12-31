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
  private readonly userStore = inject(UserStore);
  private readonly chatStore = inject(ChatStore);
  private readonly messagesStore = inject(MessagesStore);
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly roomsStore = inject(RoomsStore);

  constructor() {
    const {_id} = this.userStore.user();
    //
    //
    //
    // this.getMessagesEventListeners();
    // this.getRoomsEventListeners();
    // this.getUserEventListeners();
    effect(() => {
      const contactId = this.webSocketStore.contactId();

      const webSocketUrl = contactId ?
        `ws://localhost:8000/api/websocket/?_id=${_id}&contact_id=${contactId}` :
        `ws://localhost:8000/api/websocket/?_id=${_id}`;

      this.webSocket = new WebSocketChatClient(webSocketUrl);
    });
  }

  private getMessagesEventListeners() {
    this.webSocket?.addEventListener('NEW_MESSAGE', (event: any) => {
      this.messagesStore.setMessages([...this.messagesStore.messages(), event.detail.data.message]);
    });

    this.webSocket?.addEventListener('GET_MESSAGE', (event: any) => {
      this.messagesStore.setMessages(event.detail.data.messages);
      this.chatStore.setConversationalist(event.detail.data.user);
    });

    // this.webSocket?.addEventListener('UPDATE_MESSAGE', (event: any) => {
    // });

    this.webSocket?.addEventListener('DELETE_MESSAGE', (event: any) => {
      this.messagesStore.setMessages(
        [...this.messagesStore.messages().filter((message) => message._id !== event.detail.data.message)],
      );
    });
  }

  getRoomsEventListeners() {
    this.webSocket?.addEventListener('GET_ROOMS', (event: any) => {
      this.roomsStore.setRooms(event.detail.data.rooms);
      this.messagesStore.setMessages(event.detail.data.messages);
    });
  }

  getUserEventListeners() {
    this.webSocket?.addEventListener('GET_USER', (event: any) => {
      this.chatStore.setConversationalist(event.detail.data.user);
    });
  }
}
