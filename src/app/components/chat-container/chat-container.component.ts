import {Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css',
})
export class ChatContainerComponent {
  @Input() public setEdit!: (event: boolean, message?: Message) => void;
  protected messagesByDates: { date: string, messages: Message[] }[] = [];
  protected allMessagesList: Message[] = [];
  protected firstUnreadMessageId = '';
  private readonly webSocketStore = inject(WebsocketStore);
  private readonly userStore = inject(UserStore);
  protected userId = this.userStore.user()._id;
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
  ) {
    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();
      this.scrollContainer();
    });

    effect(() => {
      this.userId = this.userStore.user()._id;
    });
  }

  ngOnInit() {
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
  }

  private scrollContainer() {
    const isAddedMessage = this.webSocketStore.allMessagesList().length > this.allMessagesList.length;
    this.allMessagesList = this.webSocketStore.allMessagesList();
    const isSelfNewMessage = this.allMessagesList.at(-1)?.userId === this.userStore.user()._id;

    const isCheckedLastMessage = this.allMessagesList.at(-1)?.checked;

    if (isSelfNewMessage) {
      if (isAddedMessage) this.scrollContainerToBottom();
    } else {
      if (isCheckedLastMessage) {
        this.scrollContainerToBottom();
      } else {
        if (this.onScrollContainer({target: this.chatRef?.nativeElement} as unknown as Event)) {
          this.scrollContainerToBottom();
        }
      }
    }
  }

  private scrollContainerToBottom() {
    setTimeout(() => {
      if (!this.chatRef) return;
      this.chatRef?.nativeElement.removeEventListener('scroll', this.onScrollContainer);
      this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
      this.chatRef?.nativeElement.addEventListener('scroll', this.onScrollContainer);
    });
  }

  private scrollContainerToFirstUnread() {
    const allContactMessagesList = this.allMessagesList
      .filter((message) => message.userId !== this.userStore.user()._id);
    this.firstUnreadMessageId = allContactMessagesList.filter((message) => !message.checked)?.[0]?._id;

    setTimeout(() => {
      const firstUnreadMessageElement: HTMLElement | null = document.querySelector(`#message-${this.firstUnreadMessageId}`) as HTMLElement;
      if (firstUnreadMessageElement) {
        firstUnreadMessageElement.scrollIntoView();
      }
    });
  }

  private onScrollContainer(event: Event) {
    if (!event) return false;

    const element: HTMLElement | undefined = event.target as HTMLElement;
    const totalHeight = element?.scrollHeight;
    const scrollTop = element?.scrollTop;
    const clientHeight = element?.clientHeight;

    return scrollTop + clientHeight >= totalHeight - 80;
  }
}
