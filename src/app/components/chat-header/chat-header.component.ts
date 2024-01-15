import {Component, effect, inject} from '@angular/core';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute} from '@angular/router';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {
  protected contact: User | undefined;
  protected online: boolean = false;
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  protected chat: any;

  constructor(private route: ActivatedRoute) {
    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.online = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');

      this.chat = this.webSocketStore.chats().find((chat) => chat._id === this.route.snapshot.paramMap.get('_id') ?? '');
    });
  }

  protected handleAddUser() {}
}
