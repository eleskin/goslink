import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import {ChatContainerComponent} from '../chat-container/chat-container.component';
import {ChatFooterComponent} from '../chat-footer/chat-footer.component';
import {ChatHeaderComponent} from '../chat-header/chat-header.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatContainerComponent,
    ChatFooterComponent,
    ChatHeaderComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  protected message: string = '';
  private readonly userStore = inject(UserStore);
  protected edit = false;
  protected changedMessage: Message | undefined;

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebsocketService,
  ) {
    this.setEdit = this.setEdit.bind(this);
  }

  ngOnInit() {
    this.webSocketService.webSocket?.send(JSON.stringify({
      type: 'ONLINE_USER',
      data: {
        userId: this.userStore.user()._id,
        contactId: this.route.snapshot.paramMap.get('_id') ?? '',
      },
    }));
  }

  ngOnDestroy() {
    this.webSocketService.webSocket?.send(JSON.stringify({
      type: 'OFFLINE_USER',
      data: {
        userId: this.userStore.user()._id,
        contactId: this.route.snapshot.paramMap.get('_id') ?? '',
      },
    }));
  }

  protected setEdit(data: boolean, message?: Message) {
    this.edit = data;
    this.message = message ? message.text : '';
    this.changedMessage = message;
  }
}
