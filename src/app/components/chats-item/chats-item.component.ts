import {Component, effect, inject, Input} from '@angular/core';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf, NgOptimizedImage} from '@angular/common';
import WebsocketStore from '../../store/websocket/websocket.store';
import UserStore from '../../store/user/user.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import Chat from '../../interfaces/chat';

@Component({
  selector: 'app-chats-item',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './chats-item.component.html',
  styleUrl: './chats-item.component.css',
})
export class ChatsItemComponent {
  @Input() public chat!: Chat;
  protected onlineUsers: string[] = [];
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  protected readonly userStore = inject(UserStore);
  protected userId = '';

  constructor(private webSocketService: WebsocketService) {
    effect(() => {
      this.onlineUsers = this.webSocketStore.onlineUsers();
      this.userId = this.userStore.user()._id;
    });
  }

  protected handleDeleteChat(chat: Chat) {
    this.webSocketService.webSocket?.sendJSON('DELETE_CHAT', {
      userId: this.userStore.user()._id,
      chatId: chat._id,
    });
  }
}
