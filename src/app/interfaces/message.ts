import User from './user';

interface Message {
  _id: string;
  author: User;
  text: string;
  userId: string;
  contactId: string;
  dateObject: Date | string;
  time: string;

}

export default Message;
