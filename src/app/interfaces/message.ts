import User from './user';

interface Message {
  _id: string;
  author: User;
  text: string;
  userId: string;
  contactId: string;
  dateObject: Date | string;
  time: string;
  checked: boolean;
  chatId: string;
}

export default Message;
