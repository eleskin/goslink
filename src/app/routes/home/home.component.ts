import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {WebsocketService} from '../../services/websocket/websocket.service';
import RoomsStore from '../../store/rooms/rooms.store';

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
  protected visibleChat: boolean = Boolean(this.route.snapshot.paramMap.get('_id'));
  private roomsStore = inject(RoomsStore);

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService) {
    this.webSocketService.webSocket?.addEventListener('open', () => {});
  }

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('_id');
    this.roomsStore.setCurrentRoomId(roomId ?? '')
  }
}
