import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RoomsItemComponent} from '../rooms-item/rooms-item.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import Room from '../../interfaces/room';
import User from '../../interfaces/user';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    NgForOf,
    RoomsItemComponent,
    RouterLink,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class RoomsListComponent {
  protected contactId: string = '';
  @Input() rooms!: Room[] | User[];
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  @Input() public visibleModal = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });
  }

  protected handleCloseModal() {
    this.handleVisibleModal.emit(false);
  }
}
