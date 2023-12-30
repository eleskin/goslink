import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Message from '../../interfaces/message';
import User from '../../interfaces/user';

const initialStateMessages: Message[] = [];
const initialStateConversationalist: User = {
  _id: '',
  name: '',
  username: '',
  email: '',
  conversationalist: '',
  conversationalistName: '',
  lastMessage: '',
};
const initialStateOnlineUsers: string[] = [];

const ChatStore = signalStore(
  withState({
    messages: initialStateMessages,
    conversationalist: initialStateConversationalist,
    onlineUsers: initialStateOnlineUsers,
  }),
  withMethods(({...store}) => ({
    setMessages(state: Message[] = initialStateMessages) {
      patchState(store, {messages: state});
    },
    setConversationalist(state: User = initialStateConversationalist) {
      patchState(store, {conversationalist: state});
    },
    setOnlineUsers(state: string[] = initialStateOnlineUsers) {
      patchState(store, {onlineUsers: state});
    },
  })),
);

export default ChatStore;
