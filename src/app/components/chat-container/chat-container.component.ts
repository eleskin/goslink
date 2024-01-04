import {Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import {WebsocketService} from '../../services/websocket/websocket.service';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';
import UserStore from '../../store/user/user.store';
import {ActivatedRoute} from '@angular/router';
import {IntersectionObserverService} from '../../services/intersection-observer/intersection-observer.service';

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

  constructor(
    private webSocketService: WebsocketService,
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
  ) {
    effect(() => {
      const messagesByDates = this.webSocketStore.messagesByDates();
      this.messagesByDates = messagesByDates;

      const allMessages = messagesByDates
        .map((item) => item.messages)
        .flat()
        .filter((message) => message.contactId === this.userStore.user()._id);

      setTimeout(() => {
        this.scrollToFirstUnreadMessage(allMessages);

        if (this.chatRef) {
          this.intersectionObserverService.setupIntersectionObserver(this.chatRef?.nativeElement, allMessages);
        }
      })
    });
    // effect(() => {
    //   const messagesByDates = this.webSocketStore.messagesByDates();
    //   const allMessages = messagesByDates.map((item) => item.messages).flat();
    //   const firstUnreadMessage = allMessages.find((message) => {
    //     return !message.checked && message.contactId === this.userStore.user()._id;
    //   });
    //
    //   if (allMessages.at(-1)?.userId === this.userStore.user()._id) {
    //     setTimeout(() => {
    //       if (this.chatRef?.nativeElement) {
    //         this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
    //       }
    //     }, 0);
    //   } else {
    //     setTimeout(() => {
    //       const firstUnreadMessageElement = document.querySelector(`#message-${firstUnreadMessage?._id}`);
    //
    //       if (!firstUnreadMessageElement) {
    //         if (this.chatRef?.nativeElement) {
    //           this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
    //         }
    //       } else {
    //         firstUnreadMessageElement?.scrollIntoView({behavior: 'auto', block: 'start'});
    //       }
    //     });
    //   }
    //
    //   this.messagesByDates = messagesByDates;
    //
    //   this.setupIntersectionObserver();
    // });
  }

  private scrollToFirstUnreadMessage(messages: Message[]) {
    const firstUnreadMessageId = messages.filter((message) => !message.checked)[0]?._id;

    if (firstUnreadMessageId) {
      const firstUnreadMessageElement = document.querySelector(`#message-${firstUnreadMessageId}`);

      firstUnreadMessageElement?.scrollIntoView({behavior: 'auto', block: 'start'});
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserverService.observer) {
      this.intersectionObserverService.observer.disconnect();
    }
  }
}
