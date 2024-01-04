import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntersectionObserverService {
  private observer: IntersectionObserver | undefined;

  constructor() {
  }

  private markAsRead(messageId: string): void {
    if (!messageId) return;

    console.log(messageId);

    // this.webSocketService.sendMessage({type: 'message_read', id: messageId});
    // Отметьте сообщение как прочитанное в интерфейсе, если нужно
  }

  public setupIntersectionObserver(messageContainerElement: HTMLElement) {
    const options = {
      root: messageContainerElement,
      rootMargin: '0px',
      threshold: 1.0
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
