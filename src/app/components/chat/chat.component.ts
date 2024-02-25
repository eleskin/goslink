import {Component, inject, Input} from '@angular/core';
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
  @Input() class = '';

  protected message: string = '';
  protected edit = false;
  protected changedMessage: Message | undefined;
  private readonly userStore = inject(UserStore);

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService) {
  }

  ngOnInit() {
    this.webSocketService.webSocket?.sendJSON('ONLINE_USER', {
      userId: this.userStore.user()._id,
      chatId: this.route.snapshot.paramMap.get('_id') ?? '',
    });
  }

  ngOnDestroy() {
    this.webSocketService.webSocket?.sendJSON('OFFLINE_USER', {
      userId: this.userStore.user()._id,
      chatId: this.route.snapshot.paramMap.get('_id') ?? '',
    });
  }

  protected setEdit({data, message}: {data: boolean, message?: Message}) {
    this.edit = data;
    this.message = message?.text ?? '';
    this.changedMessage = message;
  }
}
