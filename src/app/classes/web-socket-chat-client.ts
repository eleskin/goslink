enum WebSocketChatClientEventMessageType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  GET_MESSAGES = 'GET_MESSAGES',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
}

class WebSocketChatClient extends WebSocket {
  constructor(url: string) {
    super(url);

    super.addEventListener('message', (event) => {
      super.dispatchEvent(new CustomEvent(event.type, {detail: {data: event.data}}));
    });
  }
}

export default WebSocketChatClient;
