import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';
import Message from '../../interfaces/message';
import {computed} from '@angular/core';

type WebsocketState = {
  readyState: number,
  contactId: string,
  rooms: User[],
  searchedUser: User | undefined,
  contact: User | undefined,
  messagesByDates: { date: string, messages: Message[] }[],
  onlineUsers: string[],
};

const initialState: WebsocketState = {
  readyState: 0,
  contactId: '',
  rooms: [],
  searchedUser: undefined,
  contact: undefined,
  messagesByDates: [],
  onlineUsers: [],
};

const WebsocketStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    allMessagesList: computed(() => {
      return store.messagesByDates().map((item) => item.messages).flat();
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
    setMessagesByDate(state = []) {
      patchState(store, {messagesByDates: state});
    },
    updateMessage(state = null) {
      const messagesByDates = store.messagesByDates().map((item) => {
        return {
          date: item.date, messages: item.messages.map((message) => {
            if (message._id === state._id) message.text = state.text;
            return message;
          }),
        };
      });

      patchState(store, {messagesByDates});
    },
    setRead(state = '') {
      const messagesByDates = store.messagesByDates().map((item) => {
        return {
          date: item.date, messages: item.messages.map((message) => {
            if (message._id === state) message.checked = true;
            return message;
          }),
        };
      });

      patchState(store, {messagesByDates});
    },
    setAllRead() {
      const messagesByDates = store.messagesByDates().map((item) => {
        return {
          date: item.date, messages: item.messages.map((message) => {
            message.checked = true;
            return message;
          }),
        };
      });

      patchState(store, {messagesByDates});
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
  })),
);

export default WebsocketStore;
