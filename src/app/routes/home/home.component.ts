import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
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

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService) {
    console.log(this.roomId);
    this.websocketService.webSocket = new WebSocketChatClient('ws://localhost:8000/api/websocket');

    this.websocketService.webSocket.addEventListener('open', () => {
      this.websocketService.setHandlers();
    });
    // this.webSocketStore.setContactId(this.contactId);
    // this.websocketService.webSocket?.addEventListener('open', () => {
    // });
  }
}
