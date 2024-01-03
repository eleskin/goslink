import {Component, effect, ElementRef, inject, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {InputComponent} from '../input/input.component';
import {ButtonComponent} from '../button/button.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MessageComponent} from '../message/message.component';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import User from '../../interfaces/user';
import WebsocketStore from '../../store/websocket/websocket.store';
import UserStore from '../../store/user/user.store';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgOptimizedImage,
    InputComponent,
    ButtonComponent,
    NgForOf,
    FormsModule,
    MessageComponent,
    NgIf,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  protected message: string = '';
  private readonly webSocketStore = inject(WebsocketStore);
  protected contact: User | null = this.webSocketStore.contact();
  protected messages: Message[] = this.webSocketStore.messages();
  protected online: boolean = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');
  private readonly userStore = inject(UserStore);
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('form') private formRef: ElementRef<HTMLFormElement> | undefined;
  protected edit = false;
  private changedMessage: Message | undefined;

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebsocketService,
  ) {
    this.webSocketService.webSocket?.addEventListener('message', () => {
      setTimeout(() => {
        if (this.chatRef?.nativeElement) {
          this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
        }
      }, 0);
    });

    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.messages = this.webSocketStore.messages();

      this.online = this.webSocketStore.onlineUsers().includes(this.route.snapshot.paramMap.get('_id') ?? '');
    });
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

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message?.trim()) return;

    this.webSocketService.webSocket?.send(JSON.stringify({
      type: this.changedMessage ? 'EDIT_MESSAGE' : 'NEW_MESSAGE',
      data: {
        _id: this.changedMessage ? this.changedMessage._id : null,
        userId: this.userStore.user()._id,
        contactId: this.route.snapshot.paramMap.get('_id') ?? '',
        text: this.message,
      },
    }));

    this.message = '';
    this.edit = false;
    this.changedMessage = undefined;
  }

  setEdit(data: boolean, message?: Message) {
    this.edit = data;

    if (message) {
      this.message = message.text;
      this.changedMessage = message;
    } else {
      this.message = '';
      this.changedMessage = undefined;
    }
  }

  setMessage(event: any) {
    this.message = event.target.value;
  }
}
