class WebSocketChatClient extends WebSocket {
  constructor(...params: [url: string | URL, protocols?: string | string[]]) {
    super(...params);

    super.addEventListener('message', (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data);
      super.dispatchEvent(new CustomEvent(payload.type, {detail: {...event, data: payload.data}}));
    });
  }

  public override send(data: string | Blob | ArrayBufferView | ArrayBufferLike) {
    if (super.readyState === 1) {
      super.send(data);
    } else {
      super.addEventListener('open', () => {
        super.send(data);
      });
    }
  }

  public sendJSON(type: string, data: any) {
    const payload = JSON.stringify({
      type,
      data,
    });

    this.send(payload);
  }
}

export default WebSocketChatClient;
