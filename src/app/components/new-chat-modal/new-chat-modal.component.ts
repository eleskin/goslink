import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {ChatComponent} from '../chat/chat.component';
import {ModalComponent} from '../../ui/modal/modal.component';
import {InputComponent} from '../../ui/input/input.component';
import getGradientFromChar from '../../utils/getGradientFromChar';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-new-chat-modal',
  standalone: true,
  imports: [
    ChatComponent,
    ModalComponent,
    InputComponent,
    NgIf,
    RouterLink,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.css',
})
export class NewChatModalComponent {
  @Input() visibleModal = false;
  @Output() handleVisibleModal = new EventEmitter<boolean>();
  private readonly webSocketStore = inject(WebsocketStore);
  protected searchedUser: User | null = this.webSocketStore?.searchedUser();

  constructor(private websocketService: WebsocketService) {
    effect(() => {
      this.searchedUser = this.webSocketStore?.searchedUser();
    });
  }

  protected handleCloseModal() {
    this.handleVisibleModal.emit(false);
  }

  protected async handleInputSearch(event: any) {
    if (!(event.target.value.trim().length > 1 && event.target.value.search(/^@[a-zA-Z0-9]*/) !== -1)) return;

    this.websocketService.webSocket?.sendJSON('SEARCH_USER', {
      contactUsername: event.target.value.slice(1),
    });
  }

  protected readonly getGradientFromChar = getGradientFromChar;
}
