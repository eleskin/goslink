import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {InputComponent} from '../../ui/input/input.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import Room from '../../interfaces/room';
import {RoomsItemComponent} from '../rooms-item/rooms-item.component';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    NgForOf,
    InputComponent,
    NgIf,
    RouterLink,
    RoomsItemComponent,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class RoomsListComponent {
  @Output() public handleOpenNewChatModal = new EventEmitter<boolean>();
  protected contactId: string = '';
  protected rooms: Room[] = [];
  private readonly webSocketStore = inject(WebsocketStore);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });

    effect(() => {
      this.rooms = this.webSocketStore.rooms();
    });
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }
}
