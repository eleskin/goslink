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
      this.messagesByDates = this.webSocketStore.messagesByDates();


      if (!this.chatRef) return;

      const messagesByDates = this.webSocketStore.messagesByDates();

      const allMessages = messagesByDates
        .map((item) => item.messages)
        .flat();

      const allContactMessages = allMessages
        .filter((message) => message.contactId === this.userStore.user()._id);

      const isLastSelfMessage = allMessages.at(-1)?.userId === this.userStore.user()._id;
      if (isLastSelfMessage) {
        this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      } else {
        console.log(allContactMessages);
        this.scrollToFirstUnreadMessage(allContactMessages);
      }
    });
  }

  private scrollToFirstUnreadMessage(allContactMessages: Message[]) {
    const firstUnreadMessageId = allContactMessages.filter((message) => !message.checked)[0]?._id;

    if (firstUnreadMessageId) {
      const firstUnreadMessageElement = document.querySelector(`#message-${firstUnreadMessageId}`);

      firstUnreadMessageElement?.scrollIntoView({behavior: 'auto', block: 'start'});
    }
  }

  ngOnInit() {
    setTimeout(() => {
      if (!this.chatRef) return;

      this.intersectionObserverService.setupIntersectionObserver(
        this.chatRef?.nativeElement,
        this.route.snapshot.paramMap.get('_id') ?? '',
      );
    });
  }

  ngOnDestroy() {
    if (this.intersectionObserverService.observer) {
      this.intersectionObserverService.observer.disconnect();
    }
  }
}
