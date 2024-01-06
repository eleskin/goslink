import {Component, effect, inject, Input} from '@angular/core';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import Room from '../../interfaces/room';
import WebsocketStore from '../../store/websocket/websocket.store';
import User from '../../interfaces/user';

@Component({
  selector: 'app-rooms-item',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './rooms-item.component.html',
  styleUrl: './rooms-item.component.css',
})
export class RoomsItemComponent {
  @Input() public room!: Room | User;
  protected onlineUsers: string[] = [];
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);

  constructor() {
    effect(() => {
      this.onlineUsers = this.webSocketStore.onlineUsers();
    });
  }
}
