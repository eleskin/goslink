import {Component, Input} from '@angular/core';
import {ChatComponent} from '../chat/chat.component';
import {ModalComponent} from '../../ui/modal/modal.component';

@Component({
  selector: 'app-new-chat-modal',
  standalone: true,
	imports: [
		ChatComponent,
		ModalComponent,
	],
  templateUrl: './new-chat-modal.component.html',
  styleUrl: './new-chat-modal.component.css'
})
export class NewChatModalComponent {
  @Input() visibleModal = false;
}
