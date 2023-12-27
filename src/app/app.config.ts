import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {authorizationInterceptor} from './interceptors/authorization.interceptor';
import UserStore from './store/user/user.store';
import RoomsStore from './store/rooms/rooms.store';
import ChatStore from './store/chat/chat.store';

const store = [
  UserStore,
  RoomsStore,
  ChatStore,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideStore(),
    ...store,
  ],
};
