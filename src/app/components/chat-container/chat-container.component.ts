import {Component, effect, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {IntersectionObserverService} from '../../services/intersection-observer/intersection-observer.service';
import UserStore from '../../store/user/user.store';
import isAvailableScrollChat from '../../utils/isAvailableScrollChat';
import {Subscription} from 'rxjs';
import deleteParam from '../../utils/deleteParam';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    FormsModule,
    MessageComponent,
    NgForOf,
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css',
})
export class ChatContainerComponent {
  protected setEdit(data: boolean, message?: Message) {
    this.edit.emit({data, message});
  };

  protected messagesByDates: { date: string, messages: Message[] }[] = [];
  protected allMessagesList: Message[] = [];
  protected firstUnreadMessageId = '';
  protected userId = '';
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @Output() public edit = new EventEmitter<any>();
  private readonly routerEventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
    private router: Router,
  ) {
    this.routerEventSubscription = this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        const params = new URLSearchParams(value.url.split('?')[1]);
        const messageValue = params.get('message');

        const interval = setInterval(() => {
          const messageElement: HTMLElement | null = document.querySelector(`#message-${messageValue}`) as HTMLElement;

          if (messageElement) {
            messageElement.scrollIntoView({behavior: 'smooth'});
            messageElement.style.background = 'var(--main-color-3)';
            setTimeout(() => {
              messageElement.style.background = '';
            }, 1000)
            clearInterval(interval);
          }
        }, 100);
      }
    });

    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();
      this.scrollContainer();
      this.userId = this.userStore.user()._id;
    });
  }

  async ngOnInit() {
    const params = new URLSearchParams(this.router.url.split('?')[1]);

    if (params.get('message')) {
      await this.router.navigate([deleteParam(this.router.url, 'message')]);
    }

    setTimeout(() => {
      if (!this.chatRef) return;

      this.scrollContainerToFirstUnread();

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

    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

  private scrollContainer() {
    const params = new URLSearchParams(this.router.url.split('?')[1]);
    const isAddedMessage = this.webSocketStore.allMessagesList().length > this.allMessagesList.length;
    this.allMessagesList = this.webSocketStore.allMessagesList();
    const isSelfNewMessage = this.allMessagesList.at(-1)?.userId === this.userId;

    const isCheckedLastMessage = this.allMessagesList.at(-1)?.checked;

    if (params.get('message')) return;

    if (isSelfNewMessage && isAddedMessage) {
      this.scrollContainerToBottom();
    } else if (isCheckedLastMessage) {
      this.scrollContainerToBottom();
    } else if (isAvailableScrollChat({target: this.chatRef?.nativeElement} as unknown as Event)) {
      this.scrollContainerToBottom();
    }
  }

  private scrollContainerToBottom() {
    setTimeout(() => {
      if (!this.chatRef) return;

      this.chatRef?.nativeElement.removeEventListener('scroll', isAvailableScrollChat);
      this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      this.chatRef?.nativeElement.addEventListener('scroll', isAvailableScrollChat);
    });
  }

  private scrollContainerToFirstUnread() {
    const allContactMessagesList = this.allMessagesList
      .filter((message) => message.userId !== this.userId);
    this.firstUnreadMessageId = allContactMessagesList.filter((message) => !message.checked)?.[0]?._id;

    setTimeout(() => {
      const firstUnreadMessageElement: HTMLElement | null = document.querySelector(`#message-${this.firstUnreadMessageId}`) as HTMLElement;
      if (firstUnreadMessageElement) {
        firstUnreadMessageElement.scrollIntoView();
      }
    });
  }
}
