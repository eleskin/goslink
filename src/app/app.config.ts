import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {authorizationInterceptor} from './interceptors/authorization.interceptor';
import UserStore from './store/user/user.store';
import WebsocketStore from './store/websocket/websocket.store';
import MessagesStore from './store/messages/messages.store';
import InterfaceStore from './store/interface/interface.store';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

const store = [
  UserStore,
  WebsocketStore,
  MessagesStore,
  InterfaceStore,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideAnimations(),
    provideStore(),
    ...store,
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};
