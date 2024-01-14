import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ChatsItemComponent} from '../chats-item/chats-item.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import User from '../../interfaces/user';
import {WebsocketService} from '../../services/websocket/websocket.service';
import UserStore from '../../store/user/user.store';

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
export class RoomsListComponent {
  protected contactId: string = '';
  @Input() rooms!: User[];
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  @Input() public visibleModal = false;
  @Input() public searchList = false;
  private readonly userStore = inject(UserStore);

  constructor(private route: ActivatedRoute, private router: Router, private webSocketService: WebsocketService) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });
  }

  protected async handleCloseModal(chat: User) {
    this.handleVisibleModal.emit(false);

    if (this.searchList) {
      this.webSocketService.webSocket?.sendJSON('NEW_CHAT', {
        userId: this.userStore.user()._id,
        contactId: chat._id,
      });
    } else {
      await this.router.navigate([`/chat/${chat._id}`]);
    }
  }
}
