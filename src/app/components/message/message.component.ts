import {Component, effect, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import Message from '../../interfaces/message';
import UserStore from '../../store/user/user.store';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {ActivatedRoute} from '@angular/router';

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
  @Input() public message!: Message;
  protected selfMessage: boolean = false;
  private readonly userStore = inject(UserStore);
  private user: User = this.userStore.user();

  constructor(private webSocketService: WebsocketService, private route: ActivatedRoute) {
    console.log(new Date().getTimezoneOffset() / 60)
    effect(() => {
      this.user = this.userStore.user();
    });
  }

  ngOnInit() {
    this.selfMessage = this.message?.userId === this.user._id;
  }

  protected handleClickDelete(message: Message) {
    this.webSocketService.webSocket?.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      data: {
        _id: message._id,
        userId: this.user._id,
        contactId: this.route.snapshot.paramMap.get('_id') ?? '',
      },
    }));
  }

  protected handleClickEdit(message: Message) {

  }
}
