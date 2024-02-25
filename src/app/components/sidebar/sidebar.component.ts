import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ChatsListComponent} from '../chats-list/chats-list.component';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import {Router, RouterLink} from '@angular/router';
import MessagesStore from '../../store/messages/messages.store';
import Chat from '../../interfaces/chat';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputComponent,
    NgOptimizedImage,
    ChatsListComponent,
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
  protected chats: Chat[] = [];
  private readonly userStore = inject(UserStore);
  protected searchedMessages: Chat[] = [];
  protected userId = '';
  protected searchFieldValue = '';

  constructor(private webSocketService: WebsocketService, private userService: UserService, private router: Router) {
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

  protected async handleClickLogout() {
    try {
      await this.userService.logout();
    } catch (error) {
    } finally {
      await this.router.navigate(['/login']);
    }
  }
}
