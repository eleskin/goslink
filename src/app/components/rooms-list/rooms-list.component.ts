import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {RoomsItemComponent} from '../rooms-item/rooms-item.component';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
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
  @Input() rooms!: User[];
  @Output() public handleVisibleModal = new EventEmitter<boolean>();
  @Input() public visibleModal = false;
  @Input() public searchList = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.contactId = this.route.snapshot.paramMap.get('_id') ?? '';
      }
    });
  }

  protected handleCloseModal(room: User) {
    this.handleVisibleModal.emit(false);

    if (this.searchList) {
      console.log(room.lastMessage?._id);
    }
  }
}
