import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import removeJWT from '../../utils/removeJWT';
import UserStore from '../../store/user/user.store';

export const canActivateInternalRouteGuard: CanActivateFn = async () => {
  const userStore = inject(UserStore);
  const userService = inject(UserService);
  const router = inject(Router);

  try {
    await userService.getUser();

    if (userStore.user()) {
      return true;
    }

    removeJWT();
    return router.createUrlTree(['welcome']);
  } catch (error) {
    removeJWT();
    return router.createUrlTree(['welcome']);
  }
};
