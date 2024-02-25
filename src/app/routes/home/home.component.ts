import {Component, inject} from '@angular/core';
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
import {SidebarComponent} from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChatComponent,
    NgIf,
    ModalComponent,
    NewChatModalComponent,
    SidebarComponent,
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
  protected visibleModal = false;

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService, private router: Router) {
    this.webSocketService.webSocket =
      new WebSocketChatClient(`wss://api.goslink-messenger.online:8000/api/websocket?_id=${this.userStore.user()._id}`);

    this.webSocketService.webSocket.addEventListener('open', () => {
      this.webSocketService.setHandlers();
    });

    this.routerEventSubscription = this.router.events.subscribe(async (value) => {
      const contactId = this.route.snapshot.paramMap.get('_id');
      if (value instanceof NavigationEnd) {
        if (contactId) {
          // console.log(contactId);
          this.webSocketStore.setSearchedUser(null);

          this.webSocketService.webSocket?.sendJSON('GET_MESSAGE', {
            userId: this.userStore.user()._id,
            chatId: this.route.snapshot.paramMap.get('_id') ?? '',
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

  protected handleOpenModal() {
    this.visibleModal = true;
  }

  ngOnInit() {
    this.webSocketService.webSocket?.sendJSON('GET_CHAT', {
      userId: this.userStore.user()._id,
    });
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }
}
