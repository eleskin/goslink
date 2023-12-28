import {Component, inject} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ChatService} from '../../services/chat/chat.service';
import ChatStore from '../../store/chat/chat.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RoomsListComponent,
    ChatComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected visibleChat: boolean = Boolean(this.route.snapshot.paramMap.get('username'));
  private chatStore = inject(ChatStore);

  constructor(private route: ActivatedRoute, private chatService: ChatService) {
    this.chatService.webSocket?.addEventListener('open', () => {
      this.chatService.createNewUserRequest(this.route.snapshot.paramMap.get('username') ?? '');
    });

    this.chatStore.setConversationalist(this.route.snapshot.paramMap.get('username') ?? '');
  }
}
