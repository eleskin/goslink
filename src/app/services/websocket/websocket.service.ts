import {inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import WebsocketStore from '../../store/websocket/websocket.store';
import Message from '../../interfaces/message';
import {Router} from '@angular/router';
import MessagesStore from '../../store/messages/messages.store';
import Chat from '../../interfaces/chat';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public webSocket: WebSocketChatClient | undefined;
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly messagesStore = inject(MessagesStore);
  private readonly userHandlers: [string, (event: any) => void][] = [
    ['SEARCH_USER', (event: any) => {
      this.webSocketStore.setSearchedUser(event.detail.data.user);
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

      this.messagesStore.setMessages([
        ...this.messagesStore.messages(),
        message,
      ]);

      const isExistChat = this.webSocketStore.chats().filter((chat: any) => {
        return chat?._id === message.chatId;
      }).length;

      if (!isExistChat) {
        const chat: Chat = {
          _id: message.chatId,
          name: message.author.name,
          lastMessage: message,
          group: false,
        };

        this.webSocketStore.setChats([
          ...this.webSocketStore.chats(),
          chat,
        ]);
      }

      this.setLastChatMessage(this.webSocketStore.chats(), message);
    }],
    ['DELETE_MESSAGE', (event: any) => {
      this.messagesStore.setMessages(
        this.messagesStore.messages().filter((message: Message) => message._id !== event.detail.data.deletedMessage?._id),
      );
      const chatId = event.detail.data.deletedMessage?.chatId;
      this.setLastChatMessage(
        this.webSocketStore.chats(),
        this.messagesStore.messages().filter((message) => message.chatId === chatId).at(-1),
        event.detail.data.deletedMessage,
      );

      if (!this.messagesStore.messages().filter((message) => message.chatId === chatId).at(-1)) {
        this.router.navigate(['/']);
      }
    }],
    ['EDIT_MESSAGE', (event: any) => {
      this.messagesStore.updateMessage(event.detail.data.message);

      this.setLastChatMessage(this.webSocketStore.chats(), event.detail.data.message);
    }],
    ['READ_MESSAGE', (event: any) => {
      this.messagesStore.setRead(event.detail.data._id);
    }],
    ['READ_ALL_MESSAGE', (event: any) => {
      this.messagesStore.setAllRead(event.detail.data._id);
    }],
    ['SEARCH_MESSAGE', (event: any) => {
      this.messagesStore.setSearchedMessages(event.detail.data.searchedMessages);
    }],
    ['GET_MESSAGE', async (event: any) => {
      this.webSocketStore.setContact(event.detail.data.users?.[0] || {
        name: 'Group chat',
      });
      this.messagesStore.setMessages(event.detail.data.messages);
    }],
  ];
  private readonly chatHandlers: [string, (event: any) => void][] = [
    ['GET_CHAT', (event: any) => {
      this.webSocketStore.setChats(event.detail.data.chats);
      this.webSocketStore.setOnlineUser(event.detail.data.onlineChats);
    }],
    ['NEW_CHAT', async (event: any) => {
      this.webSocketStore.setContact(event.detail.data.contact);
      await this.router.navigate([`chat/${event.detail.data.chat._id}`]);
    }],
    ['NEW_GROUP_CHAT', async (event: any) => {
      await this.router.navigate(['/']);
      await this.router.navigate([`chat/${event.detail.data.chat._id}`]);
    }],
    ['DELETE_CHAT', async (event: any) => {
      this.webSocketStore.setChats(this.webSocketStore.chats().filter((chat) => chat._id !== event.detail.data.chat._id));
      await this.router.navigate(['/']);
    }],
  ];

  constructor(private router: Router) {
  }

  public setHandlers() {
    for (const [key, value] of this.userHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }

    for (const [key, value] of this.messageHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }

    for (const [key, value] of this.chatHandlers) {
      this.webSocket?.addEventListener(String(key), value);
    }
  }

  private setLastChatMessage(chats: Chat[], lastMessage: Message | undefined, deletedMessage?: Message) {
    if (!lastMessage) {
      this.webSocketStore.deleteChat(deletedMessage?.chatId);
      return;
    }

    for (const chat of chats) {
      if (chat?._id === lastMessage.chatId) {
        chat.lastMessage = lastMessage;
      }
    }

    chats.sort((chat1, chat2) => {
      const date1 = new Date(chat1.lastMessage?.dateObject ?? '');
      const date2 = new Date(chat2.lastMessage?.dateObject ?? '');

      if (date1 > date2) return -1;
      if (date1 < date2) return 1;
      return 0;
    });

    this.webSocketStore.setChats(chats);
  }
}
