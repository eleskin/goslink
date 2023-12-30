import {effect, inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {WebsocketService} from '../websocket/websocket.service';
import WebsocketStore from '../../store/websocket/websocket.store';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly websocketStore = inject(WebsocketStore);

  constructor(private router: Router, private websocketService: WebsocketService) {
    effect(() => {
      this.router.events.subscribe(async (value) => {
        if (value instanceof NavigationEnd && this.websocketStore.readyState() === 1 && /\/chat\/[a-zA-z0-9]*$/gm.test(value.url)) {
          const conversationalistIdPosition = value.url.search(/chat\/[a-zA-z0-9]*$/gm);

          if (conversationalistIdPosition === -1) return;

          const conversationalistId = value.url.slice(conversationalistIdPosition).split('/').at(-1);

          this.websocketService.webSocket?.send(JSON.stringify({
            type: 'GET_USER',
            data: {
              conversationalistId: conversationalistId,
            },
          }));
        }
      });
    });
  }
}
