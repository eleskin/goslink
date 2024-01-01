import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import WebSocketChatClient from '../../classes/web-socket-chat-client';

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
  private readonly roomId = this.route.snapshot.paramMap.get('_id') ?? '';
  protected visibleChat: boolean = Boolean(this.roomId);
  private readonly webSocketStore = inject(WebsocketStore);

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService, private router: Router) {
    console.log(this.roomId);
    this.websocketService.webSocket = new WebSocketChatClient('ws://localhost:8000/api/websocket');

    this.websocketService.webSocket.addEventListener('open', () => {
      this.websocketService.setHandlers();
    });
    // this.webSocketStore.setContactId(this.contactId);
    // this.websocketService.webSocket?.addEventListener('open', () => {
    // });
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        if (this.route.snapshot.paramMap.get('_id')) {
          this.webSocketStore.setSearchedUser(null);
        }
      }
    });
  }
}
