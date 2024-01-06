import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgOptimizedImage} from '@angular/common';
import {RoomsListComponent} from '../rooms-list/rooms-list.component';
import Room from '../../interfaces/room';
import WebsocketStore from '../../store/websocket/websocket.store';

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
  protected rooms: Room[] = [];

  constructor() {
    effect(() => {
      this.rooms = this.webSocketStore.rooms();
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }
}
