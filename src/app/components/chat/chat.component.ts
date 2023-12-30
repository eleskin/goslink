import {Component, effect, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {InputComponent} from '../input/input.component';
import {ButtonComponent} from '../button/button.component';
import {FormsModule} from '@angular/forms';
import User from '../../interfaces/user';
import {ActivatedRoute} from '@angular/router';
import {MessageComponent} from '../message/message.component';
import {ChatService} from '../../services/chat/chat.service';
import UserStore from '../../store/user/user.store';
import ChatStore from '../../store/chat/chat.store';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import WebsocketStore from '../../store/websocket/websocket.store';
import MessagesStore from '../../store/messages/messages.store';

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
  protected conversationalistName: string = '';
  protected messages: Message[] = [];
  private readonly chatStore = inject(ChatStore);
  private readonly userStore = inject(UserStore);
  private readonly websocketStore = inject(WebsocketStore);
  private readonly messagesStore = inject(MessagesStore);
  @Output() private updateMessage: EventEmitter<string> = new EventEmitter();
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  private user: User = this.userStore.user();
  private conversationalistId: string = this.route.snapshot.paramMap.get('_id') ?? '';

  constructor(
    private route: ActivatedRoute,
    // private chatService: ChatService,
    private webSocketService: WebsocketService,
  ) {


    // if (!this.webSocketService.webSocket) return;

    this.webSocketService.webSocket?.addEventListener('message', () => this.handleMessageWebSocket());

    this.updateMessage.subscribe((value) => this.message = value);


    effect(() => {
      this.online = this.chatStore.onlineUsers().includes(this.conversationalistId);
      this.user = this.userStore.user();
      this.conversationalistName = this.chatStore.conversationalistName();
      this.messages = this.messagesStore.messages();
    });

    effect(() => {
      if (this.websocketStore.readyState() === 1) {
        this.webSocketService.webSocket?.send(JSON.stringify({
          type: 'GET_MESSAGE',
          data: {
            conversationalistId: this.conversationalistId,
          },
        }));
        // this.webSocketService.webSocket?.send(JSON.stringify({
        //   type: 'NEW_MESSAGE',
        //   data: {
        //     conversationalistId: this.conversationalistId,
        //   },
        // }));
      }
    });
  }

  protected handleInputMessage(event: any) {
    this.updateMessage.emit(event.target.value);
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message) return;

    this.webSocketService.webSocket?.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      data: {
        conversationalistId: this.conversationalistId,
        text: this.message,
      },
    }));
    // this.webSocketService.createNewMessageRequest({
    //   ...this.getChatArgs(),
    //   name: this.user.name,
    //   message: this.message,
    // });
    this.updateMessage.emit('');
  }

  private getChatArgs() {
    return {
      username: this.user.username,
      conversationalist: this.conversationalistId,
    };
  }

  private handleMessageWebSocket() {
    setTimeout(() => {
      if (this.chatRef) {
        this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
