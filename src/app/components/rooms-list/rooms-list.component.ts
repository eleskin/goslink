import {Component, effect, inject} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RoomsItemComponent} from '../rooms-item/rooms-item.component';
import Room from '../../interfaces/room';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    NgForOf,
    RoomsItemComponent,
    RouterLink,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class RoomsListComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  protected rooms: Room[] = [];
  protected contactId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });

    effect(() => {
      this.rooms = this.webSocketStore.rooms();
    });
  }
}
