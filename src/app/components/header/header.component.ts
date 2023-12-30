import {Component, effect, inject} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import UserStore from '../../store/user/user.store';
import User from '../../interfaces/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  openPopup: boolean = false;
  disabledBackButton: boolean = true;
  private readonly userStore = inject(UserStore);
  protected user: User = this.userStore.user();

  constructor(private userService: UserService, private router: Router) {
    effect(() => {
      this.user = this.userStore.user();
    });
  }

  protected async handleClickLogout() {
    this.openPopup = false;
    try {
      await this.userService.logout();
    } catch (error) {
    } finally {
      await this.router.navigate(['/login']);
    }
  }

  protected async handleClickBack() {
    await this.router.navigate(['/']);
  }

  ngOnInit() {
    this.router.events.subscribe(async (value) => {
      if (value instanceof NavigationEnd) {
        this.disabledBackButton = value.url === '/';
      }
    });
  }
}
