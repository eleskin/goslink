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
  protected searchedUsers: User[] = [];
  protected readonly truncate = truncate;
  protected conversationalist: string = this.route.snapshot.paramMap.get('_id') ?? '';
  // private readonly chatStore = inject(ChatStore);
  private readonly webSocketStore = inject(WebsocketStore);
  protected rooms: Room[] = [];

  constructor(protected route: ActivatedRoute, private userService: UserService) {
    effect(() => {
      this.rooms = this.webSocketStore.rooms();
      this.rooms = this.webSocketStore.rooms().map((room: any) => {
        room.online = true;
        // room.online = this.chatStore.onlineUsers().includes(room.conversationalist);
        return room;
      });
    });
  }

  protected async handleInputSearch(event: any) {
    const user: User = await this.userService.searchUser(event.target.value);

    if (Object.keys(user).length) {
      this.searchedUsers.length = 0;
      this.searchedUsers.push(user);
    } else {
      this.searchedUsers.length = 0;
    }
  }
}
