interface Room {
  _id: string;
  name: string;
  lastMessage: string;
  lastMessageDate: Date | string;
}

export default Room;
