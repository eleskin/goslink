import {effect, inject, Injectable} from '@angular/core';
import Message from '../../interfaces/message';
import {WebsocketService} from '../websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import {ActivatedRoute} from '@angular/router';
import WebsocketStore from '../../store/websocket/websocket.store';

@Injectable({
  providedIn: 'root',
})
export class IntersectionObserverService {
  public observer: IntersectionObserver | undefined;
  private messages: Message[] = [];
  private contactId = '';
  private userStore = inject(UserStore);
  private webSocketStore = inject(WebsocketStore);

  constructor(private webSocketService: WebsocketService, private route: ActivatedRoute) {
    effect(() => {
      this.messages = this.webSocketStore.messagesByDates()
        .map((item) => item.messages)
        .flat()
        .filter((message) => message.contactId === this.userStore.user()._id);

      setTimeout(() => {
        this.messages.forEach((message, index) => {
          const element = document.querySelector(`#message-${message._id}`);
          element && this.observer?.observe(element);
        });
      })
    });
  }

  private markAsRead(messageId: string): void {
    if (!messageId) return;

    const _id = messageId.split('-')[1];

    if (this.messages.at(-1)?._id === _id) {
      this.webSocketService.webSocket?.send(JSON.stringify({
        type: 'READ_ALL_MESSAGE',
        data: {
          userId: this.userStore.user()._id,
          contactId: this.contactId,
        },
      }));
    } else {
      this.webSocketService.webSocket?.send(JSON.stringify({
        type: 'READ_MESSAGE',
        data: {
          _id: _id,
          userId: this.userStore.user()._id,
          contactId: this.contactId,
        },
      }));
    }
  }

  public setupIntersectionObserver(messageContainerElement: HTMLElement, contactId: string) {
    this.contactId = contactId;

    const options = {
      root: messageContainerElement,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageElement = entry.target as HTMLElement;
          // this.markAsRead(messageElement.getAttribute('id') ?? '');
          observer.unobserve(entry.target);
        }
      }, options);
    });
  }
}
