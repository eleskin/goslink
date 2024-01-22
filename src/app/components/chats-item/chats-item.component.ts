import {Component, effect, inject, Input} from '@angular/core';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf, NgOptimizedImage} from '@angular/common';
import WebsocketStore from '../../store/websocket/websocket.store';
import UserStore from '../../store/user/user.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import Chat from '../../interfaces/chat';
import User from '../../interfaces/user';

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
  @Input() public searchList = false;
  protected onlineUsers: string[] = [];
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  protected readonly userStore = inject(UserStore);
  protected chatName = '';
  protected user: User = this.userStore.user();

  constructor(private webSocketService: WebsocketService) {
    effect(() => {
      this.onlineUsers = this.webSocketStore.onlineUsers();
      this.user = this.userStore.user();

      if (!this.chat.group) {
        this.chatName = this.chat.name.split('|')[0] !== this.user.name
          ? this.chat.name.split('|')[0]
          : this.chat.name.split('|')[1];
      } else {
        this.chatName = this.chat.name;
      }
    });
  }

  protected handleDeleteChat(chat: Chat) {
    this.webSocketService.webSocket?.sendJSON('DELETE_CHAT', {
      userId: this.userStore.user()._id,
      chatId: chat._id,
    });
  }
}
