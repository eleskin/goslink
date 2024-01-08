const isAvailableScrollChat = (event: Event) => {
  if (!event) return false;

  const element: HTMLElement | undefined = event.target as HTMLElement;
  const scrollTop = Math.round(element?.scrollTop ?? 0);
  const clientHeight = Math.round(element?.clientHeight ?? 0);
  const scrollHeight = Math.round(element?.scrollHeight ?? 0);

  return scrollTop + clientHeight >= scrollHeight - 80;
};

export default isAvailableScrollChat;
