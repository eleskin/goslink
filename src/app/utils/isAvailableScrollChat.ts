const isAvailableScrollChat = (event: Event) => {
  if (!event) return false;

  const element: HTMLElement | undefined = event.target as HTMLElement;
  const totalHeight = element?.scrollHeight;
  const scrollTop = element?.scrollTop;
  const clientHeight = element?.clientHeight;

  return scrollTop + clientHeight >= totalHeight - 80;
};

export default isAvailableScrollChat;
