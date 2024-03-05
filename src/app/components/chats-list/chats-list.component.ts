import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ChatsItemComponent} from '../chats-item/chats-item.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';
import Chat from '../../interfaces/chat';
import InterfaceStore from '../../store/interface/interface.store';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    NgForOf,
    ChatsItemComponent,
    RouterLink,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.css',
})
export class ChatsListComponent {
  private readonly interfaceStore = inject(InterfaceStore);

  protected handleRightClick(event: MouseEvent, chat: Chat) {
    event.preventDefault(); // Предотвратить появление стандартного контекстного меню

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    console.log(`Позиция мыши: X = ${mouseX}, Y = ${mouseY}`);
    this.interfaceStore.setMenuCoordinates({mouseX, mouseY})
  }

  protected chatId: string = '';
  @Input() chats!: Chat[];
  @Input() public addUser = false;
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  @Input() public visibleModal = false;
  @Input() public searchList = false;
  @Input() public messagesList = false;
  private readonly userStore = inject(UserStore);

  constructor(private route: ActivatedRoute, private router: Router, private webSocketService: WebsocketService) {
    this.chatId = this.route.snapshot.paramMap.get('_id') ?? '';
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.chatId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });
  }

  protected async handleOpenChat(chat: Chat) {
    console.log(1);
    this.handleVisibleModal.emit(false);

    if (this.searchList) {
      if (this.addUser) {
        this.webSocketService.webSocket?.sendJSON('ADD_USER_CHAT', {
          userId: this.userStore.user()._id,
          chatId: this.route.snapshot.paramMap.get('_id') ?? '',
          contactId: chat._id,
        });
      } else {
        this.webSocketService.webSocket?.sendJSON('NEW_CHAT', {
          userId: this.userStore.user()._id,
          contactId: chat._id,
        });
      }
    } else if (this.messagesList) {
      await this.router.navigate([`/chat/${chat._id}`]);
      setTimeout(async () => {
        await this.router.navigate([`/chat/${chat._id}`], {
          queryParams: {
            message: chat.lastMessage._id,
          },
        });
      }, 400);
    } else {
      await this.router.navigate([`/chat/${chat._id}`]);
    }
  }
}
