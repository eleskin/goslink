import Message from './message';

interface Chat {
  _id: string;
  name: string;
  lastMessage: Message;
}

export default Chat;
