import {Component} from '@angular/core';
import {RoomsListComponent} from '../../components/rooms-list/rooms-list.component';
import {ChatComponent} from '../../components/chat/chat.component';
import {NgIf} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ChatService} from '../../services/chat/chat.service';

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

  constructor(private route: ActivatedRoute, private chatService: ChatService, private router: Router) {
    this.chatService.webSocket?.addEventListener('open', () => {
      this.chatService.createNewUserRequest(this.route.snapshot.paramMap.get('username') ?? '');
    });

    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.chatService.createNewUserRequest(this.route.snapshot.paramMap.get('username') ?? '');
      }
    });
  }
}
