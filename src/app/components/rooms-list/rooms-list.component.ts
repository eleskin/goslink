import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {InputComponent} from '../../ui/input/input.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import Room from '../../interfaces/room';
import GetGradientFromChar from '../../utils/getGradientFromChar';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    InputComponent,
    NgIf,
    RouterLink,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class RoomsListComponent {
  protected contactId: string = this.route.snapshot.paramMap.get('_id') ?? '';
  private readonly webSocketStore = inject(WebsocketStore);
  protected rooms: Room[] = this.webSocketStore.sortedRooms();
  protected onlineUsers: string[] = this.webSocketStore.onlineUsers();
  @Output() handleOpenNewChatModal = new EventEmitter<boolean>();

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
  ) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });

    effect(() => {
      this.rooms = this.webSocketStore.sortedRooms();
      console.log(this.webSocketStore.sortedRooms());
      this.onlineUsers = this.webSocketStore.onlineUsers();
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }

  protected readonly getGradientFromChar = GetGradientFromChar;
}
