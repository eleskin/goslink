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
    this.usernameValue = event.target.value;

    this.websocketService.webSocket?.sendJSON('SEARCH_USER', {
      contactUsername: event.target.value,
    });
  }

  protected handleClickNewChat() {
    this.websocketService.webSocket?.sendJSON('NEW_GROUP_CHAT', {
      userId: this.userStore.user()._id,
    });
  }

  protected keyPressAlphanumeric(event: any) {
    const navigationKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Clear',
      'Copy',
      'Paste',
      'Control',
    ];

    if (navigationKeys.includes(event.key) || /[$a-zA-Z0-9^]/.test(event.key)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  protected changeValueAlphanumeric(event: any) {
    if (/[$a-zA-Z0-9]/.test(event.target.value)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
