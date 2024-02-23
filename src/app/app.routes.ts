import {Routes} from '@angular/router';
import {HomeComponent} from './routes/home/home.component';
import {LoginComponent} from './routes/login/login.component';
import {RegisterComponent} from './routes/register/register.component';
import {canActivateInternalRouteGuard} from './guards/can-activate-internal-route/can-activate-internal-route.guard';
import {canActivateExternalRouteGuard} from './guards/can-activate-external-route/can-activate-external-route.guard';
import {WelcomeComponent} from './routes/welcome/welcome.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [canActivateInternalRouteGuard],
    data: {animationState: 0},
  },
  {
    path: 'chat/:_id', component: HomeComponent, canActivate: [canActivateInternalRouteGuard],
    data: {animationState: 1},
  },
  {
    path: 'welcome', component: WelcomeComponent, canActivate: [canActivateExternalRouteGuard],
    data: {animationState: 2},
  },
  {
    path: 'login', component: LoginComponent, canActivate: [canActivateExternalRouteGuard],
    data: {animationState: 3},
  },
  {
    path: 'register', component: RegisterComponent, canActivate: [canActivateExternalRouteGuard],
    data: {animationState: 4},
  },
];
