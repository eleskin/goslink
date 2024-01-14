import {Component, effect, inject, Input} from '@angular/core';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import WebsocketStore from '../../store/websocket/websocket.store';
import User from '../../interfaces/user';
import UserStore from '../../store/user/user.store';

@Component({
  selector: 'app-chats-item',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './chats-item.component.html',
  styleUrl: './chats-item.component.css',
})
export class RoomsItemComponent {
  @Input() public room!: User;
  protected onlineUsers: string[] = [];
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  protected readonly userStore = inject(UserStore);
  protected userId = '';

  constructor() {
    effect(() => {
      this.onlineUsers = this.webSocketStore.onlineUsers();
      this.userId = this.userStore.user()._id;
    });
  }
}
