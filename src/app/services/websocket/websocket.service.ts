import {effect, inject, Injectable} from '@angular/core';
import WebSocketChatClient from '../../classes/web-socket-chat-client';
import UserStore from '../../store/user/user.store';
import MessagesStore from '../../store/messages/messages.store';
import WebsocketStore from '../../store/websocket/websocket.store';
import RoomsStore from '../../store/rooms/rooms.store';
import ChatStore from '../../store/chat/chat.store';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
}
