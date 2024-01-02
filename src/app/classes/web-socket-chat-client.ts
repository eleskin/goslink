class WebSocketChatClient extends WebSocket {
  constructor(url: string) {
    super(url);

    super.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data);
      super.dispatchEvent(new CustomEvent(payload.type, {detail: {data: payload.data}}));
    });
  }

  public override send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (super.readyState === 1) {
      super.send(data);
    } else {
      super.addEventListener('open', () => {
        super.send(data);
      });
    }
  }
}

export default WebSocketChatClient;
