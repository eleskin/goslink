import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatComponent} from '../chat/chat.component';
import {ModalComponent} from '../../ui/modal/modal.component';
import {InputComponent} from '../../ui/input/input.component';

@Component({
  selector: 'app-new-chat-modal',
  standalone: true,
  imports: [
    ChatComponent,
    ModalComponent,
    InputComponent,
  ],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.css'
})
export class NewChatModalComponent {
  @Input() visibleModal = false;
  @Output() handleVisibleModal = new EventEmitter<boolean>();

  protected handleCloseModal() {
    this.handleVisibleModal.emit(false);
  }
}
