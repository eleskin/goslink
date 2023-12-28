import {inject, Injectable} from '@angular/core';
import UserStore from '../../store/user/user.store';
import ChatStore from '../../store/chat/chat.store';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public webSocket: WebSocket | undefined;
  private readonly chatStore = inject(ChatStore);
  private readonly userStore = inject(UserStore);

  constructor(private router: Router) {
    this.webSocket = new WebSocket(`ws://localhost:8000/api/websocket/?_id=${this.userStore.user()._id}`);

    this.webSocket?.addEventListener('message', (event: any) => this.handleMessageWebSocket(event));

    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.createNewUserRequest(this.chatStore.conversationalist());
      }
    });
  }

  public createNewMessageRequest(data: {
    username: string;
    name: string;
    conversationalist: string;
    message: string;
  }) {
    this.webSocket?.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      ...data,
    }));
  }

  public deleteMessageRequest(data: {
    _id: string;
    username: string;
    conversationalist: string;
  }) {
    this.webSocket?.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      ...data,
    }));
  }

  private async handleMessageWebSocket(event: any) {
    const data = JSON.parse(event.data);
    if (data?.type === 'NEW_USER') {
      this.chatStore.setConversationalistName(data.conversationalistName);
    } else if (data.type === 'NEW_MESSAGE') {
      this.chatStore.setMessages(data.messages);
    } else if (data.type === 'NEW_MESSAGES') {
      this.chatStore.setMessages(data.messages);
    } else if (data.type === 'SET_ONLINE') {
      if (data.data?.conversationalist) {
        this.chatStore.setOnlineUsers([...new Set([...this.chatStore.onlineUsers(), data.data.conversationalist])]);
      } else if (data.data?.conversationalists) {
        this.chatStore.setOnlineUsers([...new Set([...this.chatStore.onlineUsers(), ...data.data.conversationalists])]);
      }
    } else if (data.type === 'SET_OFFLINE') {
      this.chatStore.setOnlineUsers(this.chatStore.onlineUsers().filter((user) => user !== data.data.conversationalist));
    }
  }

  public createNewUserRequest(conversationalist: string) {
    if (this.webSocket?.readyState === 1) {
      this.webSocket.send(JSON.stringify({
        type: 'NEW_USER',
        username: this.userStore.user().username,
        online: Boolean(conversationalist),
        conversationalist,
      }));
    }
  }
}
