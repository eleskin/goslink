import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import WebsocketStore from '../../store/websocket/websocket.store';
import Message from '../../interfaces/message';
import User from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userHandlers: [string, (event: any) => void][] = [
    ['SEARCH_USER', (event: any) => {
      this.webSocketStore.setSearchedUser(event.detail.data.user);
    }],
    ['GET_USER', (event: any) => {
      this.webSocketStore.setContact(event.detail.data.user);
      this.webSocketStore.setMessages(event.detail.data.messages);
    }],
    ['ONLINE_USER', (event: any) => {
      this.webSocketStore.setOnlineUser([event.detail.data.userId]);
    }],
    ['OFFLINE_USER', (event: any) => {
      this.webSocketStore.setOfflineUser(event.detail.data.userId);
    }],
  ];
  private readonly messageHandlers: [string, (event: any) => void][] = [
    ['NEW_MESSAGE', (event: any) => {
      const {message} = event.detail.data;

      this.webSocketStore.setMessages([
        ...this.webSocketStore.messages(),
        message,
      ]);

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
    }],
    ['DELETE_MESSAGE', (event: any) => {
      const rooms = this.webSocketStore.rooms();
      const {lastMessage} = event.detail.data;

      this.webSocketStore.setMessages(
        this.webSocketStore.messages().filter((message: Message) => message._id !== event.detail.data.removedMessageId),
      );
      this.setLastRoomMessage(rooms, lastMessage, event.detail.data.userId, event.detail.data.contactId);
    }],
    ['EDIT_MESSAGE', (event: any) => {
      this.webSocketStore.updateMessage(event.detail.data.message);
    }],
    ['READ_MESSAGE', (event: any) => {
      this.webSocketStore.setRead(event.detail.data._id);
    }],
    ['READ_ALL_MESSAGE', (event: any) => {
      this.webSocketStore.setAllRead(event.detail.data);
    }],
    ['SEARCH_MESSAGE', (event: any) => {
      this.webSocketStore.setSearchedMessages(event.detail.data.searchedMessages);
    }],
  ];
  private readonly roomHandlers: [string, (event: any) => void][] = [
    ['GET_ROOM', (event: any) => {
      this.webSocketStore.setRooms(event.detail.data.rooms);
      this.webSocketStore.setOnlineUser(event.detail.data.onlineRooms);
    }],
  ];

  public setHandlers() {
    for (const [key, value] of this.userHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }

    for (const [key, value] of this.messageHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }

    for (const [key, value] of this.roomHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }
  }

  private setLastRoomMessage(rooms: User[], message: Message, userId?: string, contactId?: string) {
    if (!message && userId && contactId) {
      this.webSocketStore.deleteRoom(userId);
      this.webSocketStore.deleteRoom(contactId);
      return;
    }

    for (const room of rooms) {
      if (room?._id === message.userId || room?._id === message.contactId) {
        room.lastMessage = message;
      }
    }

    rooms.sort((room1, room2) => {
      const date1 = new Date(room1.lastMessage?.dateObject ?? '');
      const date2 = new Date(room2.lastMessage?.dateObject ?? '');

      if (date1 > date2) return -1;
      if (date1 < date2) return 1;
      return 0;
    });

    this.webSocketStore.setRooms(rooms);
  }
}
