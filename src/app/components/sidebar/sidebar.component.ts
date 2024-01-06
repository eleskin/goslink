import {Component, EventEmitter, Output} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {NgOptimizedImage} from '@angular/common';
import {RoomsListComponent} from '../rooms-list/rooms-list.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputComponent,
    NgOptimizedImage,
    RoomsListComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Output() public handleOpenNewChatModal = new EventEmitter<boolean>();

  constructor() {
  }

  protected handleClickNewChatButton() {
    this.handleOpenNewChatModal.emit(true);
  }
}
