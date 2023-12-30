import {Component, effect, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import Message from '../../interfaces/message';
import {ChatService} from '../../services/chat/chat.service';
import {ActivatedRoute} from '@angular/router';
import UserStore from '../../store/user/user.store';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() public message: Message = {
    _id: '',
    author: '',
    text: '',
    userId: '',
  };
  protected selfMessage: boolean = false;
  private readonly userStore = inject(UserStore);
  private user: User = this.userStore.user();

  constructor(private chatService: ChatService, private route: ActivatedRoute, private webSocketService: WebsocketService) {
    effect(() => {
      this.user = this.userStore.user();
    });
  }

  ngOnInit() {
    this.selfMessage = this.message.userId === this.user._id;
  }

  protected handleClickDelete(message: Message) {
    this.webSocketService.webSocket?.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      data: {
        _id: message._id,
      },
    }));
  }
}
