import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import UserStore from '../../store/user/user.store';

export const canActivateExternalRouteGuard: CanActivateFn = async () => {
  const userStore = inject(UserStore);
  const userService = inject(UserService);
  const router = inject(Router);

  try {
    await userService.getUser();

    if (!userStore.user()) {
      return true;
    }
    return router.createUrlTree(['']);
  } catch (error) {
    return true;
  }
};
