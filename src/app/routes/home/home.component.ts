import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import {Subscription} from 'rxjs';

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
  private readonly contactId = this.route.snapshot.paramMap.get('_id') ?? '';
  protected visibleChat: boolean = Boolean(this.contactId);
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  private readonly routerEventSubscription: Subscription;

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService, private router: Router) {
    this.webSocketService.webSocket =
      new WebSocketChatClient(`ws://localhost:8000/api/websocket?_id=${this.userStore.user()._id}`);

    this.webSocketService.webSocket.addEventListener('open', () => {
      this.webSocketService.setHandlers();
    });

    this.routerEventSubscription = this.router.events.subscribe(async (value) => {
      const contactId = this.route.snapshot.paramMap.get('_id');
      if (value instanceof NavigationEnd) {
        if (contactId) {
          this.webSocketStore.setSearchedUser(null);

          const request = JSON.stringify({
            type: 'GET_USER',
            data: {
              userId: this.userStore.user()._id,
              contactId: contactId,
            },
          });

          if (this.webSocketService.webSocket?.readyState === 1) {
            this.webSocketService.webSocket.send(request);
          } else {
            this.webSocketService.webSocket?.addEventListener('open', () => {
              this.webSocketService.webSocket?.send(request);
            });
          }
        }
      }
    });
  }

  ngOnInit() {
    const request = JSON.stringify({
      type: 'GET_ROOM',
      data: {
        userId: this.userStore.user()._id,
      },
    });

    if (this.webSocketService.webSocket?.readyState === 1) {
      this.webSocketService.webSocket.send(request);
    } else {
      this.webSocketService.webSocket?.addEventListener('open', () => {
        this.webSocketService.webSocket?.send(request);
      });
    }
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }
}
