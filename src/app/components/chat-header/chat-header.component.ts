import {Component, effect, inject} from '@angular/core';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute} from '@angular/router';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import {NewChatModalComponent} from '../new-chat-modal/new-chat-modal.component';
import {ButtonComponent} from '../../ui/button/button.component';
import Chat from '../../interfaces/chat';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    NgIf,
    NewChatModalComponent,
    ButtonComponent,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {
  protected contact: User | undefined;
  protected online: boolean = false;
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  protected chat: Chat | undefined;
  protected visibleModal = false;

  constructor(private route: ActivatedRoute) {
    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.online = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');

      this.chat = this.webSocketStore.chats().find((chat) => chat._id === this.route.snapshot.paramMap.get('_id') ?? '');
      console.log(this.chat);
    });
  }

  protected handleAddUser() {
    this.visibleModal = true;
  }

  protected handleCloseModal() {
    this.visibleModal = false;
  }
}
