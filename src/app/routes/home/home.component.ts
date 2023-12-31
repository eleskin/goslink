import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RoomsListComponent,
    ChatComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly contactId = this.route.snapshot.paramMap.get('_id');
  protected visibleChat: boolean = Boolean(this.contactId);
  private readonly webSocketStore = inject(WebsocketStore);

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService) {
    this.webSocketStore.setContactId(this.contactId);
    this.websocketService.webSocket?.addEventListener('open', () => {
    });
  }
}
