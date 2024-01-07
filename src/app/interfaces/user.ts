import Message from './message';

interface User {
  _id: string;
  name: string;
  lastMessage?: Message;
}

export default User;
