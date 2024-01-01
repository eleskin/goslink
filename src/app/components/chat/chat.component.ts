import {Component, effect, ElementRef, inject, ViewChild} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
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
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  protected message: string = '';
  protected online: boolean = false;
  private readonly webSocketStore = inject(WebsocketStore);
  protected contact: User | null = this.webSocketStore.contact();
  protected messages: Message[] = this.webSocketStore.messages();
  private readonly userStore = inject(UserStore);
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('form') private formRef: ElementRef<HTMLFormElement> | undefined;
  private contactId: string = this.route.snapshot.paramMap.get('_id') ?? '';

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
  ) {
    effect(() => {
      this.contact = this.webSocketStore.contact();
      this.messages = this.webSocketStore.messages();
    });
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message.trim()) return;

    this.websocketService.webSocket?.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      data: {
        userId: this.userStore.user()._id,
        contactId: this.contactId,
        text: this.message,
      },
    }));

    this.formRef?.nativeElement.reset();
  }
}
