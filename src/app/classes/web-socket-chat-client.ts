class WebSocketChatClient extends WebSocket {
  constructor(url: string) {
    super(url);

    // super.addEventListener('open', () => webSocketStore.setReadyState(1));

    super.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data);
      super.dispatchEvent(new CustomEvent(payload.type, {detail: {data: payload.data}}));
    });
  }
}

export default WebSocketChatClient;
