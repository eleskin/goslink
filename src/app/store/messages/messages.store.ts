import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Message from '../../interfaces/message';

const initialStateMessages: Message[] = [];

const messagesStore = signalStore(
  withState({
    messages: initialStateMessages,
  }),
  withMethods(({...store}) => ({
    setMessages(state = initialStateMessages) {
      patchState(store, {messages: state});
    },
  })),
);

export default messagesStore;
