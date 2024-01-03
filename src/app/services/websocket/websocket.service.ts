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

  private setLastRoomMessage(rooms: any, message: any, roomId?: string) {
    if (!message && roomId) {
      this.webSocketStore.deleteRoom(roomId);
      return;
    }

    for (const room of rooms) {
      if (room?._id === message.userId || room?._id === message.contactId) {
        room.lastMessage = message.text;
      }
    }
  }

  public setHandlers() {
    this.webSocket?.addEventListener('SEARCH_USER', (event: any) => {
      this.webSocketStore.setSearchedUser(event.detail.data.user);
    });
    this.webSocket?.addEventListener('GET_USER', (event: any) => {
      this.webSocketStore.setContact(event.detail.data.user);
      this.webSocketStore.setMessages(event.detail.data.messages);
    });
    this.webSocket?.addEventListener('NEW_MESSAGE', (event: any) => {
      const {message} = event.detail.data;

      this.webSocketStore.setMessages([...this.webSocketStore.messages(), message]);

      const isExistRoom = !this.webSocketStore.rooms().filter((room: any) => {
        return room?._id === message.author?._id || room?._id === message.contact?._id;
      }).length;

      if (isExistRoom) {
        this.webSocketStore.setRooms([
          ...this.webSocketStore.rooms(),
          this.webSocketStore.contact()?._id === message.contact._id ? message.contact : message.author,
        ]);
      }

      this.setLastRoomMessage(this.webSocketStore.rooms(), message);
    });
    this.webSocket?.addEventListener('DELETE_MESSAGE', (event: any) => {
      const rooms = this.webSocketStore.rooms();
      const {lastMessage} = event.detail.data;

      this.webSocketStore.setMessages(this.webSocketStore.messages().filter((message: Message) => {
        return message._id !== event.detail.data.removedMessageId;
      }));

      this.setLastRoomMessage(rooms, lastMessage, event.detail.data.roomId);
    });
    this.webSocket?.addEventListener('GET_ROOM', (event: any) => {
      this.webSocketStore.setRooms(event.detail.data.rooms);
      this.webSocketStore.setOnlineUser(event.detail.data.onlineRooms);
    });
    this.webSocket?.addEventListener('ONLINE_USER', (event: any) => {
      this.webSocketStore.setOnlineUser([event.detail.data.userId]);
    });
    this.webSocket?.addEventListener('OFFLINE_USER', (event: any) => {
      this.webSocketStore.setOfflineUser(event.detail.data.userId);
    });
  }
}
