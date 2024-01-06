import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {InputComponent} from '../../ui/input/input.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
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
  protected searchedUser: User | null = this.webSocketStore?.searchedUser();
  protected rooms: Room[] = this.webSocketStore?.rooms();
  protected onlineUsers: string[] = this.webSocketStore.onlineUsers();
  @Output() handleOpenNewChatModal = new EventEmitter<boolean>();

  constructor(
    protected route: ActivatedRoute,
    private websocketService: WebsocketService,
    private router: Router,
  ) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });

    effect(() => {
      this.searchedUser = this.webSocketStore?.searchedUser();
      this.rooms = this.webSocketStore?.rooms();
      this.onlineUsers = this.webSocketStore.onlineUsers();
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }

  protected async handleInputSearch(event: any) {
    if (!(event.target.value.trim().length > 1 && event.target.value.search(/^@[a-zA-Z0-9]*/) !== -1)) return;

    this.websocketService.webSocket?.sendJSON('SEARCH_USER', {
      contactUsername: event.target.value.slice(1),
    });
  }

  protected readonly getGradientFromChar = GetGradientFromChar;
}
