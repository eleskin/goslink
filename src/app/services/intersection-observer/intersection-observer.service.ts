import {effect, inject, Injectable} from '@angular/core';
import Message from '../../interfaces/message';
import {WebsocketService} from '../websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';

@Injectable({
  providedIn: 'root',
})
export class IntersectionObserverService {
  public observer: IntersectionObserver | undefined;
  private messages: Message[] = [];
  private userStore = inject(UserStore);
  private messagesStore = inject(MessagesStore);

  constructor(private webSocketService: WebsocketService) {
    effect(() => {
      this.messages = this.messagesStore.messages()
        .filter((message) => message.userId !== this.userStore.user()._id && !message.checked);

      setTimeout(() => {
        this.messages.forEach((message) => {
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
      this.webSocketService.webSocket?.sendJSON('READ_ALL_MESSAGE', {
        _id: _id,
        chatId: this.messagesStore.messages().find((message) => message._id === _id)?.chatId
      })
    } else {
      this.webSocketService.webSocket?.sendJSON('READ_MESSAGE', {
        _id: _id,
        chatId: this.messagesStore.messages().find((message) => message._id === _id)?.chatId
      });
    }
  }

  public destroyIntersectionObserver() {
    this.observer = undefined;
  }

  public setupIntersectionObserver(messageContainerElement: HTMLElement) {
    const options = {
      root: messageContainerElement,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageElement = entry.target as HTMLElement;
          this.markAsRead(messageElement.getAttribute('id') ?? '');
          observer.unobserve(entry.target);
        }
      }, options);
    });
  }
}
