import {Component, effect, EventEmitter, inject, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {RoomsItemComponent} from '../rooms-item/rooms-item.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import Room from '../../interfaces/room';
import WebsocketStore from '../../store/websocket/websocket.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputComponent,
    NgForOf,
    NgOptimizedImage,
    RoomsItemComponent,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
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
