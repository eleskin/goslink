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
import {ModalComponent} from '../../ui/modal/modal.component';
import {NewChatModalComponent} from '../../components/new-chat-modal/new-chat-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RoomsListComponent,
    ChatComponent,
    NgIf,
    ModalComponent,
    NewChatModalComponent,
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
  private previousUrl = '';
  protected visibleModal = true;

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

          this.webSocketService.webSocket?.sendJSON('GET_USER', {
            userId: this.userStore.user()._id,
            contactId: contactId,
          });

          this.webSocketService.webSocket?.sendJSON('ONLINE_USER', {
            userId: this.userStore.user()._id,
            contactId: this.route.snapshot.paramMap.get('_id') ?? '',
          });

          this.webSocketService.webSocket?.sendJSON('OFFLINE_USER', {
            userId: this.userStore.user()._id,
            contactId: this.previousUrl.slice(this.previousUrl.search(/\/[0-9a-z-A-Z]*$/gm) + 1),
          });

          this.previousUrl = value.url;
        }
      }
    });
  }

  protected handleCloseModal() {
    this.visibleModal = false;
  }

  ngOnInit() {
    this.webSocketService.webSocket?.sendJSON('GET_ROOM', {
      userId: this.userStore.user()._id,
    });
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }
}
