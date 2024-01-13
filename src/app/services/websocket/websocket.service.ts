import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import WebsocketStore from '../../store/websocket/websocket.store';
import Message from '../../interfaces/message';
import User from '../../interfaces/user';
import {ActivatedRoute, Router} from '@angular/router';
import UserStore from '../../store/user/user.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  private readonly userHandlers: [string, (event: any) => void][] = [
    ['SEARCH_USER', (event: any) => {
      // this.webSocketStore.setSearchedUser(event.detail.data.user);
    }],
    ['GET_USER', (event: any) => {
      // this.webSocketStore.setContact(event.detail.data.user);
      // this.webSocketStore.setMessages(event.detail.data.messages);
    }],
    ['ONLINE_USER', (event: any) => {
      // this.webSocketStore.setOnlineUser([event.detail.data.userId]);
    }],
    ['OFFLINE_USER', (event: any) => {
      // this.webSocketStore.setOfflineUser(event.detail.data.userId);
    }],
  ];
  private readonly messageHandlers: [string, (event: any) => void][] = [
    ['NEW_MESSAGE', (event: any) => {
      // const {message} = event.detail.data;
      // const {userChatName} = event.detail.data;
      // const {contactChatName} = event.detail.data;
      //
      // console.log(message.chatId)
      // console.log(this.route.snapshot.paramMap.get('_id'))
      // if (message.chatId === this.route.snapshot.paramMap.get('_id')) {
      //   this.webSocketStore.setMessages([
      //     ...this.webSocketStore.messages(),
      //     message,
      //   ]);
      // }
      //
      // const isExistRoom = this.webSocketStore.rooms().filter((room: any) => {
      //   return room?._id === message.chatId;
      // }).length;
      //
      // if (!isExistRoom) {
      //   const room = {
      //     _id: message.chatId,
      //     name: message.userId === this.userStore.user()._id ? userChatName : contactChatName,
      //     lastMessage: message,
      //   }
      //
      //   this.webSocketStore.setRooms([
      //     ...this.webSocketStore.rooms(),
      //     room,
      //   ]);
      // }
      //
      // this.setLastRoomMessage(this.webSocketStore.rooms(), message);
    }],
    ['DELETE_MESSAGE', (event: any) => {
      // this.webSocketStore.setMessages(
      //   this.webSocketStore.messages().filter((message: Message) => message._id !== event.detail.data.deletedMessage._id),
      // );
      // const {chatId} = event.detail.data.deletedMessage;
      // this.setLastRoomMessage(
      //   this.webSocketStore.rooms(),
      //   this.webSocketStore.messages().filter((message) => message.chatId === chatId).at(-1),
      //   event.detail.data.deletedMessage,
      // );
    }],
    ['EDIT_MESSAGE', (event: any) => {
      // this.webSocketStore.updateMessage(event.detail.data.message);
    }],
    ['READ_MESSAGE', (event: any) => {
      // this.webSocketStore.setRead(event.detail.data._id);
    }],
    ['READ_ALL_MESSAGE', (event: any) => {
      // this.webSocketStore.setAllRead(event.detail.data);
    }],
    ['SEARCH_MESSAGE', (event: any) => {
      // this.webSocketStore.setSearchedMessages(event.detail.data.searchedMessages);
    }],
  ];
  private readonly roomHandlers: [string, (event: any) => void][] = [
    ['GET_ROOM', (event: any) => {
    // console.log(event.detail.data.rooms);
    //   this.webSocketStore.setRooms(event.detail.data.rooms);
    //   // this.webSocketStore.setOnlineUser(event.detail.data.onlineRooms);
    }],
  ];
  private readonly chatHandlers: [string, (event: any) => void][] = [
    ['NEW_CHAT', async (event: any) => {
      // this.webSocketStore.setContact(event.detail.data.contact);
      // await this.router.navigate([`chat/${event.detail.data.chatId}`]);
    }],
    ['GET_CHAT', async (event: any) => {
      // const contact = event.detail.data.users.filter((user: User) => user._id !== this.userStore.user()._id)[0];
      //
      // this.webSocketStore.setContact(contact);
      // this.webSocketStore.setMessages(event.detail.data.messages);
    }],
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

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

    for (const [key, value] of this.chatHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }
  }

  private setLastRoomMessage(rooms: User[], lastMessage: Message | undefined, deletedMessage?: Message) {
    if (!lastMessage) {
      this.webSocketStore.deleteRoom(deletedMessage?.chatId);
      return;
    }

    for (const room of rooms) {
      if (room?._id === lastMessage.chatId) {
        room.lastMessage = lastMessage;
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
