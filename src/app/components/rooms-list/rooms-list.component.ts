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
  protected searchedUsers: Pick<User, 'name' | 'username'>[] = [];
  protected readonly truncate = truncate;
  protected conversationalist: string = this.route.snapshot.paramMap.get('username') ?? '';
  private readonly roomsStore = inject(RoomsStore);
  private readonly chatStore = inject(ChatStore);
  protected rooms: Room[] = this.roomsStore.rooms();

  constructor(protected route: ActivatedRoute, private userService: UserService) {
    effect(() => {
      this.rooms = this.roomsStore.rooms().map((room) => {
        room.online = this.chatStore.onlineUsers().includes(room.conversationalist);
        return room;
      });
    });
  }

  protected async handleInputSearch(event: any) {
    const user: Pick<User, 'name' | 'username'> = await this.userService.searchUser(event.target.value);

    if (Object.keys(user).length) {
      this.searchedUsers.length = 0;
      this.searchedUsers.push(user);
    } else {
      this.searchedUsers.length = 0;
    }
  }
}
