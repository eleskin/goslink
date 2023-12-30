import {Routes} from '@angular/router';
import {HomeComponent} from './routes/home/home.component';
import {LoginComponent} from './routes/login/login.component';
import {RegisterComponent} from './routes/register/register.component';
import {canActivateInternalRouteGuard} from './guards/can-activate-internal-route/can-activate-internal-route.guard';
import {canActivateExternalRouteGuard} from './guards/can-activate-external-route/can-activate-external-route.guard';

export const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [canActivateInternalRouteGuard]},
  {path: 'chat/:_id', component: HomeComponent, canActivate: [canActivateInternalRouteGuard]},
  {path: 'login', component: LoginComponent, canActivate: [canActivateExternalRouteGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [canActivateExternalRouteGuard]},
];
