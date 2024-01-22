import {Component, effect, inject} from '@angular/core';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute} from '@angular/router';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import {NewChatModalComponent} from '../new-chat-modal/new-chat-modal.component';
import {ButtonComponent} from '../../ui/button/button.component';
import Chat from '../../interfaces/chat';
import getChatName from '../../utils/getChatName';
import UserStore from '../../store/user/user.store';

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
  protected readonly userStore = inject(UserStore);
  protected chat: Chat | undefined;
  protected visibleModal = false;
  protected chatName = '';

  constructor(private route: ActivatedRoute) {
    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.online = this.webSocketStore.onlineUsers().includes(this.userStore.user()._id);

      this.chat = this.webSocketStore.chats().find((chat) => chat._id === this.route.snapshot.paramMap.get('_id') ?? '');

      if (this.chat) {
        this.chatName = getChatName(this.chat, this.userStore.user().name);
      }
    });
  }

  protected handleAddUser() {
    this.visibleModal = true;
  }

  protected handleCloseModal() {
    this.visibleModal = false;
  }
}
