import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import Message from '../../interfaces/message';
import UserStore from '../../store/user/user.store';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {ActivatedRoute} from '@angular/router';
import getGradientFromChar from '../../utils/getGradientFromChar';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() public message!: Message;
  @Output() public edit = new EventEmitter<boolean>();
  protected selfMessage: boolean = false;
  protected readonly getGradientFromChar = getGradientFromChar;
  private readonly userStore = inject(UserStore);
  private user: User = this.userStore.user();

  constructor(private webSocketService: WebsocketService, private route: ActivatedRoute) {
    effect(() => {
      this.user = this.userStore.user();
    });
  }

  ngOnInit() {
    this.message.dateObject = new Date(this.message.dateObject);
    this.selfMessage = this.message?.userId === this.user._id;

    const date = new Date(this.message.dateObject);
    const hours = date.getHours().toString().length > 1 ? date.getHours().toString() : `0${date.getHours()}`;
    const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`;
    this.message.time = `${hours}:${minutes}`;
  }

  protected handleClickDelete(message: Message) {
    this.webSocketService.webSocket?.sendJSON('DELETE_MESSAGE', {
      _id: message._id,
      chatId: this.route.snapshot.paramMap.get('_id') ?? '',
    });
  }

  protected handleClickEdit() {
    this.edit.emit(true);
  }
}
