import Message from './message';

interface Chat {
  _id: string;
  name: string;
  lastMessage: Message;
  group: boolean;
}

export default Chat;
