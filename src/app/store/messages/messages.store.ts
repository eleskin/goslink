import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed} from '@angular/core';
import groupMessagesByDate from '../../utils/groupMessagesByDate';
import Message from '../../interfaces/message';

type MessagesState = {
  messages: Message[],
};


const initialState: MessagesState = {
  messages: []
}

const MessagesStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    messagesByDates: computed(() => {
      return groupMessagesByDate(store.messages());
    }),
  })),
  withMethods(({...store}) => ({
    setMessages(state = []) {
      patchState(store, {messages: state});
    },
    updateMessage(state = null) {
      const messages = store.messages().map((message) => {
        if (message._id === state._id) message.text = state.text;
        return message;
      });

      patchState(store, {messages});
    },
    setRead(state = '') {
      const messages = store.messages().map((message) => {
        if (message._id === state) message.checked = true;
        return message;
      });

      patchState(store, {messages});
    },
    setAllRead(state = '') {
      const chatId = store.messages().find((message) => message._id === state)?.chatId;
      const messages = store.messages().map((message) => {
        if (message.chatId === chatId) {
          message.checked = true;
        }
        return message;
      });

      patchState(store, {messages});
    },
  })),
);
