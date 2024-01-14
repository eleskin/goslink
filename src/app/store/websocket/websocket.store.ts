import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';
import Message from '../../interfaces/message';
import {computed} from '@angular/core';
import groupMessagesByDate from '../../utils/groupMessagesByDate';

type WebsocketState = {
  readyState: number,
  contactId: string,
  rooms: User[],
  searchedUser: User | undefined,
  contact: User | undefined,
  onlineUsers: string[],
  searchedMessages: User[],
  messages: Message[],
};

const initialState: WebsocketState = {
  readyState: 0,
  contactId: '',
  rooms: [],
  searchedUser: undefined,
  contact: undefined,
  onlineUsers: [],
  searchedMessages: [],
  messages: [],
};

const WebsocketStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    messagesByDates: computed(() => {
      return groupMessagesByDate(store.messages());
    }),
  })),
  withMethods(({...store}) => ({
    setReadyState(state = 0) {
      patchState(store, {readyState: state});
    },
    setContactId(state = '') {
      patchState(store, {contactId: state});
    },
    setRooms(state = []) {
      patchState(store, {rooms: state});
    },
    setSearchedUser(state = null) {
      patchState(store, {searchedUser: state});
    },
    setContact(state = null) {
      patchState(store, {contact: state});
    },
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
    deleteRoom(state = '') {
      const rooms = store.rooms().filter((room: any) => room._id !== state);
      patchState(store, {rooms});
    },
    setOnlineUser(state = []) {
      patchState(store, {onlineUsers: [...store.onlineUsers(), ...state]});
    },
    setOfflineUser(state = '') {
      const onlineUsers = store.onlineUsers().filter((user) => user !== state);
      patchState(store, {onlineUsers});
    },
    setSearchedMessages(state = []) {
      patchState(store, {searchedMessages: state});
    },
  })),
);

export default WebsocketStore;
