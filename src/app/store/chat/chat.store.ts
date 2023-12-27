import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Message from '../../interfaces/message';

const initialStateMessages: Message[] = [];
const initialStateConversationalistName: string = '';
const initialStateOnlineUsers: string[] = [];

const ChatStore = signalStore(
  withState({
    messages: initialStateMessages,
    conversationalistName: initialStateConversationalistName,
    onlineUsers: initialStateOnlineUsers,
  }),
  withMethods(({...store}) => ({
    setMessages(state: Message[] = initialStateMessages) {
      patchState(store, {messages: state});
    },
    setConversationalistName(state: string = initialStateConversationalistName) {
      patchState(store, {conversationalistName: state});
    },
    setOnlineUsers(state: string[] = initialStateOnlineUsers) {
      patchState(store, {onlineUsers: state});
    },
  })),
);

export default ChatStore;
