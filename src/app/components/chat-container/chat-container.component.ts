import {Component, effect, ElementRef, inject, Input, SimpleChanges, ViewChild} from '@angular/core';
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
  protected allMessagesList: Message[] = this.webSocketStore.allMessagesList();
  @ViewChild('chat') private chatRef: ElementRef<HTMLDivElement> | undefined;
  @Input() public setEdit!: (event: boolean, message?: Message) => void;
  @Input() public onFormSubmit = {};
  private isInitial = true;
  private isScrolledToNearEnd = false;
  protected firstUnreadMessageId = '';

  constructor(
    private route: ActivatedRoute,
    private intersectionObserverService: IntersectionObserverService,
  ) {
    effect(() => {
      this.messagesByDates = this.webSocketStore.messagesByDates();
      this.scrollContainer();
    });
  }

  private scrollContainer() {
    const isAddedMessage = this.webSocketStore.allMessagesList().length > this.allMessagesList.length;
    this.allMessagesList = this.webSocketStore.allMessagesList();
    const isSelfNewMessage = this.allMessagesList.at(-1)?.userId === this.userStore.user()._id;

    if (isAddedMessage) {
      const isScrolledContainer = this.onScrollContainer({target: this.chatRef?.nativeElement} as unknown as Event);

      if (isSelfNewMessage) {
        this.scrollContainerToBottom();
      } else {
        if (isScrolledContainer) {
          this.scrollContainerToBottom();
        }
      }
    }

    if (!isSelfNewMessage) {
      this.scrollContainerToFirstUnread();
    } else {
      this.scrollContainerToBottom();
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
      firstUnreadMessageElement?.scrollIntoView();
    });
  }

  // private scrollToFirstUnread(isAddedMessage: boolean) {
  //   const isLastSelfMessage = this.messagesByDates
  //     .map((item) => item.messages)
  //     .flat()
  //     .at(-1)?.userId === this.userStore.user()._id;
  //
  //   if (this.isInitial && this.messagesByDates.length) {
  //
  //     const allMessages = this.messagesByDates
  //       .map((item) => item.messages)
  //       .flat()
  //       .filter((message) => message.userId !== this.userStore.user()._id);
  //
  //     const firstUnreadMessageId = allMessages.filter((message) => !message.checked)?.[0]?._id;
  //     const firstUnreadMessageElement: HTMLElement | null = document.querySelector(`#message-${firstUnreadMessageId}`) as HTMLElement;
  //     this.firstUnreadMessageId = firstUnreadMessageId;
  //
  //     if (firstUnreadMessageElement) {
  //       firstUnreadMessageElement.scrollIntoView();
  //     } else if (this.chatRef) {
  //       this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
  //       this.isScrolledToNearEnd = true;
  //     }
  //
  //     this.isInitial = false;
  //   } else {
  //     console.log(this.isScrolledToNearEnd);
  //     if ((isLastSelfMessage || this.isScrolledToNearEnd) && isAddedMessage && this.chatRef) {
  //       this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
  //     }
  //   }
  // }

  private onScrollContainer(event: Event) {
    if (!event) return false;

    const element: HTMLElement | undefined = event.target as HTMLElement;
    const totalHeight = element?.scrollHeight;
    const scrollTop = element?.scrollTop;
    const clientHeight = element?.clientHeight;

    return scrollTop + clientHeight >= totalHeight - 80;
  }

  ngOnInit() {
    setTimeout(() => {
      if (!this.chatRef) return;

      this.chatRef.nativeElement.addEventListener('scroll', this.onScrollContainer);

      this.intersectionObserverService.setupIntersectionObserver(
        this.chatRef?.nativeElement,
        this.route.snapshot.paramMap.get('_id') ?? '',
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['onFormSubmit'] && this.chatRef) {
      // this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserverService.observer) {
      this.intersectionObserverService.observer.disconnect();
    }

    this.chatRef?.nativeElement.removeEventListener('scroll', this.onScrollContainer);
  }
}
