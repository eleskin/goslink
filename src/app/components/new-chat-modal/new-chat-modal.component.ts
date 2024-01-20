import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {ModalComponent} from '../../ui/modal/modal.component';
import {InputComponent} from '../../ui/input/input.component';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {ChatsListComponent} from '../chats-list/chats-list.component';
import {ButtonComponent} from '../../ui/button/button.component';
import UserStore from '../../store/user/user.store';
import Chat from '../../interfaces/chat';

@Component({
  selector: 'app-new-chat-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputComponent,
    NgIf,
    RouterLink,
    ChatsListComponent,
    ButtonComponent,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.css',
})
export class NewChatModalComponent {
  @Input() public visibleModal = false;
  @Input() public addUser = false;
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  protected searchedUser: Chat | undefined;
  protected usernameValue = '';
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);

  constructor(private websocketService: WebsocketService) {
    effect(() => {
      this.searchedUser = this.webSocketStore?.searchedUser();
    });
  }

  protected handleCloseModal() {
    this.handleVisibleModal.emit(false);
    this.usernameValue = '';
  }

  protected async handleInputSearch(event: any) {
    if (!(event.target.value.trim().length > 1 && event.target.value.search(/^@[a-zA-Z0-9]*/) !== -1)) return;

    this.usernameValue = event.target.value;

    this.websocketService.webSocket?.sendJSON('SEARCH_USER', {
      contactUsername: event.target.value.slice(1),
    });
  }

  protected handleClickNewChat() {
    this.websocketService.webSocket?.sendJSON('NEW_GROUP_CHAT', {
      userId: this.userStore.user()._id,
    });
  }
}
