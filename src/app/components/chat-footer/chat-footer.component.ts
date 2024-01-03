import {Component, inject, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '../input/input.component';
import {NgIf} from '@angular/common';
import Message from '../../interfaces/message';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {ActivatedRoute} from '@angular/router';
import UserStore from '../../store/user/user.store';

@Component({
  selector: 'app-chat-footer',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './chat-footer.component.html',
  styleUrl: './chat-footer.component.css',
})
export class ChatFooterComponent {
  private readonly userStore = inject(UserStore);
  @Input() public setEdit!: (event: boolean, message?: Message) => void;
  @Input() public edit!: boolean;
  @Input() public message!: string;
  @Input() public changedMessage!: Message | undefined;

  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService) {
  }

  protected handleFormSubmit(event: any) {
    event.preventDefault();

    if (!this.message?.trim()) return;
    if (this.message !== this.changedMessage?.text) {
      this.webSocketService.webSocket?.send(JSON.stringify({
        type: this.changedMessage ? 'EDIT_MESSAGE' : 'NEW_MESSAGE',
        data: {
          _id: this.changedMessage ? this.changedMessage._id : null,
          userId: this.userStore.user()._id,
          contactId: this.route.snapshot.paramMap.get('_id') ?? '',
          text: this.message,
        },
      }));
    }

    this.message = '';
    this.edit = false;
    this.changedMessage = undefined;
  }

  protected setMessage(event: any) {
    this.message = event.target.value;
  }
}