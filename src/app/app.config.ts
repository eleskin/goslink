import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {authorizationInterceptor} from './interceptors/authorization.interceptor';
import UserStore from './store/user/user.store';
import WebsocketStore from './store/websocket/websocket.store';
import MessagesStore from './store/messages/messages.store';

const store = [
  UserStore,
  WebsocketStore,
  MessagesStore,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideStore(),
    ...store,
  ],
};
