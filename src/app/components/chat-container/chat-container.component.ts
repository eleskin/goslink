import {Component, effect, ElementRef, EventEmitter, HostListener, inject, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MessageComponent} from '../message/message.component';
import {NgForOf} from '@angular/common';
import Message from '../../interfaces/message';
import WebsocketStore from '../../store/websocket/websocket.store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {IntersectionObserverService} from '../../services/intersection-observer/intersection-observer.service';
import UserStore from '../../store/user/user.store';
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
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const threshold = 80;
    const position = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight);
    this.autoScrollDisabled = position > threshold;
  }

  @Output() public edit = new EventEmitter<any>();
  protected messagesByDates: { date: string, messages: Message[] }[] = [];
  protected allMessagesList: Message[] = [];
  protected userId = '';
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  private readonly routerEventSubscription: Subscription;
  private autoScrollDisabled = false;
  protected firstUnreadMessageId = '';

  constructor(
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
    private router: Router,
    private chatRef: ElementRef,
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
            }, 1000);
            clearInterval(interval);
          }
        }, 100);
      }
    });

    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();
      this.userId = this.userStore.user()._id;

      this.scrollContainer();

      this.allMessagesList = this.webSocketStore.allMessagesList();
    });
  }

  async ngOnInit() {
    const params = new URLSearchParams(this.router.url.split('?')[1]);

    if (params.get('message')) {
      await this.router.navigate([deleteParam(this.router.url, 'message')]);
    }

    this.intersectionObserverService
      .setupIntersectionObserver(this.chatRef.nativeElement, this.route.snapshot.paramMap.get('_id') ?? '');
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }

    this.intersectionObserverService.observer?.unobserve(this.chatRef.nativeElement);
  }

  protected setEdit(data: boolean, message?: Message) {
    this.edit.emit({data, message});
  };

  private scrollContainerToBottom() {
    const isAddedMessage = this.webSocketStore.allMessagesList().length > this.allMessagesList.length;
    const isScrollDisabled = this.autoScrollDisabled && this.webSocketStore.allMessagesList().at(-1)?.userId !== this.userId;

    if (!isAddedMessage || isScrollDisabled) return;

    setTimeout(() => {
      this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
    });
  }

  private scrollContainerToFirstUnread() {
    const allContactMessagesList = this.allMessagesList
      .filter((message) => message.userId !== this.userId);
    this.firstUnreadMessageId = allContactMessagesList.find((message) => !message.checked)?._id ?? '';

    setTimeout(() => {
      const firstUnreadMessageElement: HTMLElement | null =
        document.querySelector(`#message-${this.firstUnreadMessageId}`) as HTMLElement;
      if (firstUnreadMessageElement) {
        firstUnreadMessageElement.scrollIntoView();
      }
    });
  }

  private scrollContainer() {
    if (!this.allMessagesList.at(-1)?.checked
      && this.allMessagesList.at(-1)?.userId !== this.userId
    ) {
      this.scrollContainerToFirstUnread();
    } else {
      this.scrollContainerToBottom();
    }

    // const isAddedMessage = this.webSocketStore.allMessagesList().length > this.allMessagesList.length;
    // this.allMessagesList = this.webSocketStore.allMessagesList();
    // const isSelfNewMessage = this.allMessagesList.at(-1)?.userId === this.userId;
    //
    // const isCheckedLastMessage = this.allMessagesList.at(-1)?.checked;
    //
    // if (params.get('message')) return;
    //
    // if (isSelfNewMessage && isAddedMessage) {
    //   // this.scrollContainerToBottom();
    // } else if (isCheckedLastMessage) {
    //   // this.scrollContainerToBottom();
    // } else if (isAvailableScrollChat({target: this.chatRef?.nativeElement} as unknown as Event)) {
    //   // this.scrollContainerToBottom();
    // }
  }
}
