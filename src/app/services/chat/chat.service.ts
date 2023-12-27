import {effect, inject, Injectable} from '@angular/core';
import UserStore from '../../store/user/user.store';
import ChatStore from '../../store/chat/chat.store';
import {ActivatedRoute} from '@angular/router';

interface CreateRequest {
  webSocket: WebSocket;
  username: string;
  conversationalist: string;
  online: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public webSocket: WebSocket | undefined;
  private readonly chatStore = inject(ChatStore);
  private readonly userStore = inject(UserStore);

  constructor(private route: ActivatedRoute) {
    this.webSocket = new WebSocket(`ws://localhost:8000/api/websocket/?_id=${this.userStore.user()._id}`);

    this.webSocket?.addEventListener('message', (event: any) => this.handleMessageWebSocket(event));
    console.log(this.route.snapshot.paramMap.get('username') ?? '');

    effect(() => {
      if (this.webSocket?.readyState === 1) {
        this.createNewUserRequest({
          webSocket: this.webSocket,
          username: this.userStore.user().username,
          conversationalist: this.route.snapshot.paramMap.get('username') ?? '',
          online: Boolean(this.userStore.user().conversationalist),
        });
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

  public handleOpenWebSocket(
    webSocket: WebSocket,
    {username, conversationalist, online}: Omit<CreateRequest, 'webSocket'>,
  ) {
    if (webSocket.readyState === 1) {
      this.createNewUserRequest({
        webSocket,
        username,
        conversationalist,
        online,
      });
    }
  }

  private createNewUserRequest({webSocket, username, conversationalist, online}: CreateRequest) {
    webSocket.send(JSON.stringify({
      type: 'NEW_USER',
      username,
      conversationalist,
      online,
    }));
  }

  private async handleMessageWebSocket(event: any) {
    const data = JSON.parse(event.data);
    console.log(data.data);
    if (data?.type === 'NEW_USER') {
      this.chatStore.setConversationalistName(data.conversationalistName);
    } else if (data.type === 'NEW_MESSAGE') {
      this.chatStore.setMessages(data.messages);
    } else if (data.type === 'NEW_MESSAGES') {
      this.chatStore.setMessages(data.messages);
    } else if (data.type === 'SET_ONLINE') {
      console.log(data.data);
      if (data.data?.conversationalist) {
        this.chatStore.setOnlineUsers([...new Set([...this.chatStore.onlineUsers(), data.data.conversationalist])]);
      } else if (data.data?.conversationalists) {
        this.chatStore.setOnlineUsers([...new Set([...this.chatStore.onlineUsers(), ...data.data.conversationalists])]);
      }
    } else if (data.type === 'SET_OFFLINE') {
      console.log(data.data);
      this.chatStore.setOnlineUsers(this.chatStore.onlineUsers().filter((user) => user !== data.data.conversationalist));
    }
  }
}
