import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
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
    ModalComponent,
    InputComponent,
    NgIf,
    RouterLink,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.css',
})
export class NewChatModalComponent {
  @Input() public visibleModal = false;
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  protected searchedUser: User | undefined;
  protected usernameValue = '';
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly webSocketStore = inject(WebsocketStore);

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
}
