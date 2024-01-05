import {Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute} from '@angular/router';
import {IntersectionObserverService} from '../../services/intersection-observer/intersection-observer.service';
import UserStore from '../../store/user/user.store';

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
  private isInitial = true;

  constructor(
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
  ) {
    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();

      setTimeout(() => this.scrollToFirstUnread());
      // setTimeout(() => {
      //   if (!this.chatRef) return;
      //   this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      // });
    });
  }

  private scrollToFirstUnread() {
    if (this.isInitial && this.messagesByDates.length) {
      const allMessages = this.messagesByDates
        .map((item) => item.messages)
        .flat()
        .filter((message) => message.userId !== this.userStore.user()._id);

      const firstUnreadMessageId = allMessages.filter((message) => !message.checked)[0]._id;
      const firstUnreadMessageElement = document.querySelector(`#message-${firstUnreadMessageId}`);

      firstUnreadMessageElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      this.isInitial = false;
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
