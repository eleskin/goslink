import Chat from '../interfaces/chat';

const getChatName = (chat: Chat, userName: string): string => {
  let chatName: string;

  if (!chat.group) {
    chatName = chat.name?.split('|')[0] !== userName
      ? chat.name.split('|')[0]
      : chat.name.split('|')[1];
  } else {
    chatName = chat.name;
  }

  return chatName;
};

export default getChatName;
