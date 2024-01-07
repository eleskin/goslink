interface User {
  _id: string;
  name: string;
  lastMessage?: string;
  lastMessageDate?: Date | string;
}

export default User;
