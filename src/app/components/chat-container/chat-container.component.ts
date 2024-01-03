import {Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import {WebsocketService} from '../../services/websocket/websocket.service';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';
import UserStore from '../../store/user/user.store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    FormsModule,
    MessageComponent,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css',
})
export class ChatContainerComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  protected messagesByDates: { date: string, messages: Message[] }[] = this.webSocketStore.messagesByDates();
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @Input() public setEdit!: (event: boolean, message?: Message) => void;
  private observer: IntersectionObserver | undefined;
  private firstUnreadMessage = '';

  constructor(private webSocketService: WebsocketService, private route: ActivatedRoute) {
    this.webSocketService.webSocket?.addEventListener('message', () => {
      if (this.firstUnreadMessage) return;
      setTimeout(() => {
        if (this.chatRef?.nativeElement) {
          this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
        }
      }, 0);
    });

    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();

      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 0);
    });

    effect(() => {
      if (!this.firstUnreadMessage) {
        const allMessages = this.webSocketStore.messagesByDates().map((item) => item.messages).flat();
        this.firstUnreadMessage = allMessages.find((message) => !message.checked && (message.contactId === this.userStore.user()._id))?._id ?? '';
        setTimeout(() => {
          document.querySelector(`#message-${this.firstUnreadMessage}`)?.scrollIntoView({
            behavior: 'instant',
            block: 'start',
          });
        }, 0);
      }
    });
  }

  private markAsRead(messageId: string): void {
    const _id = messageId.split('-')[1];
    const messages = this.messagesByDates.map((item) => item.messages).flat();
    const uncheckedMessages = messages.find((message) => {
      return message._id === _id && !message.checked && message.contactId === this.userStore.user()._id;
    });

    if (uncheckedMessages) {
      this.webSocketService.webSocket?.send(JSON.stringify({
        type: 'READ_MESSAGE',
        data: {
          _id,
          userId: this.userStore.user()._id,
          contactId: this.route.snapshot.paramMap.get('_id') ?? '',
        },
      }));
    }
  }

  ngOnInit() {
    setTimeout(() => {

      this.setupIntersectionObserver();
      // console.log(document.querySelector(`#message-${firstUnreadMessage?._id}`));
      // document.querySelector(`#message-${firstUnreadMessage?._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: this.chatRef?.nativeElement,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageElement = entry.target as HTMLElement;
          messageElement.getAttribute('id') && this.markAsRead(messageElement.getAttribute('id') ?? '');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.messagesByDates.forEach((item) => {
      item.messages.forEach((message) => {
        const element = document.querySelector(`#message-${message._id}`);
        element && this.observer?.observe(element);
      });
    });
  }
}
