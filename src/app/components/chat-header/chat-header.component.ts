import {Component, effect, inject} from '@angular/core';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  protected contact: User | null = this.webSocketStore.contact();
  protected online: boolean = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');

  constructor(private route: ActivatedRoute) {
    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.online = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');
    });
  }
}
