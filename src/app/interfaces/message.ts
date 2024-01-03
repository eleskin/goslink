import User from './user';

interface Message {
  _id: string;
  author: User;
  text: string;
  userId: string;
  contactId: string;
}

export default Message;
