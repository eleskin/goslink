import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Message from '../../interfaces/message';

const initialStateMessages: Message[] = [];
const initialStateConversationalistName: string = '';
const initialStateConversationalist: string = '';
const initialStateOnlineUsers: string[] = [];

const ChatStore = signalStore(
  withState({
    messages: initialStateMessages,
    conversationalistName: initialStateConversationalistName,
    conversationalist: initialStateConversationalist,
    onlineUsers: initialStateOnlineUsers,
  }),
  withMethods(({...store}) => ({
    setMessages(state: Message[] = initialStateMessages) {
      patchState(store, {messages: state});
    },
    setConversationalistName(state: string = initialStateConversationalistName) {
      patchState(store, {conversationalistName: state});
    },
    setConversationalist(state: string = initialStateConversationalist) {
      patchState(store, {conversationalist: state});
    },
    setOnlineUsers(state: string[] = initialStateOnlineUsers) {
      patchState(store, {onlineUsers: state});
    },
  })),
);

export default ChatStore;
