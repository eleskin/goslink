import { WebSocketChatClient } from './web-socket-chat-client';

describe('WebSocketChatClient', () => {
  it('should create an instance', () => {
    expect(new WebSocketChatClient()).toBeTruthy();
  });
});
