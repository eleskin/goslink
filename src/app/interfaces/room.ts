interface Room {
  _id: string;
  conversationalist: string;
  conversationalistName: string;
  lastMessage: string;
  online: boolean;
}

export default Room;
