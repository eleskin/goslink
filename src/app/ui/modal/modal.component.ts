import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() public visibleModal = false;
  @Output() public handleVisibleModal = new EventEmitter<boolean>();

  protected handleCloseModal() {
    console.log(1);
    this.handleVisibleModal.emit(false);
  }
}
