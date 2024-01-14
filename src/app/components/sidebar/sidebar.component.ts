import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {RoomsListComponent} from '../chats-list/rooms-list.component';
import WebsocketStore from '../../store/websocket/websocket.store';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import {RouterLink} from '@angular/router';
import MessagesStore from '../../store/messages/messages.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputComponent,
    NgOptimizedImage,
    RoomsListComponent,
    NgForOf,
    NgIf,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly messagesStore = inject(MessagesStore);
  @Output() public handleOpenNewChatModal = new EventEmitter<boolean>();
  protected chats: User[] = [];
  private readonly userStore = inject(UserStore);
  protected searchedMessages: User[] = [];
  protected userId = '';
  protected searchFieldValue = '';

  constructor(private webSocketService: WebsocketService) {
    effect(() => {
      this.chats = this.webSocketStore.chats();
      this.searchedMessages = this.messagesStore.searchedMessages();
      this.userId = this.userStore.user()._id;
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }

  protected handleChangeInput(event: any) {
    this.searchFieldValue = event.target.value;
    this.webSocketService.webSocket?.sendJSON('SEARCH_MESSAGE', {
      userId: this.userStore.user()._id,
      searchValue: event.target.value,
    })
  }
}
