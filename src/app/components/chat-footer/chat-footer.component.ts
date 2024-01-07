import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ButtonComponent} from '../../ui/button/button.component';
import {InputComponent} from '../../ui/input/input.component';
import {NgIf} from '@angular/common';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {ActivatedRoute, Router} from '@angular/router';
import UserStore from '../../store/user/user.store';
import deleteParam from '../../utils/deleteParam';

@Component({
  selector: 'app-chat-footer',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    NgIf,
  ],
  templateUrl: './chat-footer.component.html',
  styleUrl: './chat-footer.component.css',
})
export class ChatFooterComponent {
  protected setEdit (data: boolean, message?: Message) {
    this.edit.emit({data, message});
  };
  @Input() public message!: string;
  @Input() public changedMessage!: Message | undefined;
  @Input() public editValue: boolean = false;
  @Output() public edit = new EventEmitter<any>();
  private readonly userStore = inject(UserStore);

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService, private router: Router) {
  }

  protected async handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message?.trim()) return;
    if (this.message !== this.changedMessage?.text) {
      this.webSocketService.webSocket?.sendJSON(this.changedMessage ? 'EDIT_MESSAGE' : 'NEW_MESSAGE', {
        _id: this.changedMessage ? this.changedMessage._id : null,
        userId: this.userStore.user()._id,
        contactId: this.route.snapshot.paramMap.get('_id') ?? '',
        text: this.message,
      });
    }

    const params = new URLSearchParams(this.router.url.split('?')[1]);

    if (params.get('message')) {
      await this.router.navigate([deleteParam(this.router.url, 'message')]);
    }

    this.message = '';
    this.edit.emit({data: false});
    this.changedMessage = undefined;
  }

  protected setMessage(event: any) {
    this.message = event.target.value;
  }
}
