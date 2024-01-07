import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgOptimizedImage} from '@angular/common';
import {RoomsListComponent} from '../rooms-list/rooms-list.component';
import WebsocketStore from '../../store/websocket/websocket.store';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputComponent,
    NgOptimizedImage,
    RoomsListComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  @Output() public handleOpenNewChatModal = new EventEmitter<boolean>();
  protected rooms: User[] = [];
  private readonly userStore = inject(UserStore);

  constructor(private webSocketService: WebsocketService) {
    effect(() => {
      this.rooms = this.webSocketStore.rooms();
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }

  protected handleChangeInput(event: any) {
    this.webSocketService.webSocket?.sendJSON('SEARCH_MESSAGE', {
      userId: this.userStore.user()._id,
      searchValue: event.target.value,
    })
  }
}
