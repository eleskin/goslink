import {Component, effect, inject} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import truncate from '../../utils/truncate';
import {InputComponent} from '../input/input.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import User from '../../interfaces/user';
import RoomsStore from '../../store/rooms/rooms.store';
import Room from '../../interfaces/room';
import {UserService} from '../../services/user/user.service';
import ChatStore from '../../store/chat/chat.store';
import WebsocketStore from '../../store/websocket/websocket.store';
import {WebsocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    InputComponent,
    NgIf,
    RouterLink,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class RoomsListComponent {
  protected readonly truncate = truncate;
  protected conversationalist: string = this.route.snapshot.paramMap.get('_id') ?? '';
  // private readonly chatStore = inject(ChatStore);
  private readonly webSocketStore = inject(WebsocketStore);
  protected searchedUser: User | null = this.webSocketStore?.searchedUser();
  protected rooms: User[] = this.webSocketStore?.rooms();

  constructor(
    protected route: ActivatedRoute,
    private userService: UserService,
    private websocketService: WebsocketService,
  ) {
    // effect(() => {
    //   this.rooms = this.webSocketStore.rooms();
    //   this.rooms = this.webSocketStore.rooms().map((room: any) => {
    //     room.online = true;
    //     room.online = this.chatStore.onlineUsers().includes(room.conversationalist);
    // return room;
    // });
    // });
    effect(() => {
      this.searchedUser = this.webSocketStore?.searchedUser();
      this.rooms = this.webSocketStore?.rooms();
    });
  }

  protected async handleInputSearch(event: any) {
    if (!(event.target.value.trim().length > 1 && event.target.value.search(/^@[a-zA-Z0-9]*/) !== -1)) return;

    this.websocketService.webSocket?.send(JSON.stringify({
      type: 'SEARCH_USER',
      data: {
        contactUsername: event.target.value.slice(1),
      },
    }));
    // const user: User = await this.userService.searchUser(event.target.value);
    //
    // if (Object.keys(user).length) {
    //   this.searchedUsers.length = 0;
    //   this.searchedUsers.push(user);
    // } else {
    //   this.searchedUsers.length = 0;
    // }
  }
}
