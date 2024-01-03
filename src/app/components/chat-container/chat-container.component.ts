import {Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import {WebsocketService} from '../../services/websocket/websocket.service';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';

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
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent {
  private readonly webSocketStore = inject(WebsocketStore);
  protected messagesByDates: {date: string, messages: Message[]}[] = this.webSocketStore.messagesByDates();
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @Input() public setEdit!: (event: boolean, message?: Message) => void;
  private observer: IntersectionObserver | undefined;

  constructor(private webSocketService: WebsocketService) {
    this.webSocketService.webSocket?.addEventListener('message', () => {
      setTimeout(() => {
        if (this.chatRef?.nativeElement) {
          // this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
        }
      }, 0);
    });

    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 0)
    });
  }

  private markAsRead(messageId: string): void {
    console.log(messageId);
  }

  ngOnInit() {
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 0)
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
      threshold: 1.0
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
    })
  }
}
