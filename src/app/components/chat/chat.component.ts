import {Component, effect, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {InputComponent} from '../input/input.component';
import {ButtonComponent} from '../button/button.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MessageComponent} from '../message/message.component';
import ChatStore from '../../store/chat/chat.store';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import MessagesStore from '../../store/messages/messages.store';
import RoomsStore from '../../store/rooms/rooms.store';

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
  private readonly messagesStore = inject(MessagesStore);
  private readonly roomsStore = inject(RoomsStore);
  @Output() private updateMessage: EventEmitter<string> = new EventEmitter();
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  private conversationalistId: string = this.route.snapshot.paramMap.get('_id') ?? '';

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
  ) {
    effect(() => {
      this.online = this.chatStore.onlineUsers().includes(this.conversationalistId);
      this.conversationalistName = this.chatStore.conversationalist().name;
      this.messages = this.messagesStore.messages();


      const conversationalist = this.roomsStore.rooms()
        .filter((room) => room.conversationalist === this.conversationalistId)?.[0];
      this.conversationalistName = conversationalist?.conversationalistName ?? '';
    });
  }

  protected handleInputMessage(event: any) {
    this.updateMessage.emit(event.target.value);
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message) return;

    this.websocketService.webSocket?.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      data: {
        conversationalistId: this.conversationalistId,
        text: this.message,
      },
    }));

    this.updateMessage.emit('');
  }

  private handleMessageWebSocket() {
    setTimeout(() => {
      if (this.chatRef) {
        this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      }
    }, 0);
  }

  ngOnInit() {
    this.updateMessage.subscribe((value) => this.message = value);

    this.websocketService.webSocket?.addEventListener('open', () => {
      this.websocketService.webSocket?.send(JSON.stringify({
        type: 'GET_MESSAGE',
        data: {
          conversationalistId: this.conversationalistId,
        },
      }));
    });


    this.websocketService.webSocket?.addEventListener('message', () => this.handleMessageWebSocket());
  }
}
