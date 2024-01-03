import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';
import Message from '../../interfaces/message';
import Room from '../../interfaces/room';

type WebsocketState = {
  readyState: number,
  contactId: string,
  rooms: Room[],
  searchedUser: User | null,
  contact: User | null,
  messages: { date: string, messages: Message[] }[],
  onlineUsers: string[],
};

const initialState: WebsocketState = {
  readyState: 0,
  contactId: '',
  rooms: [],
  searchedUser: null,
  contact: null,
  messages: [],
  onlineUsers: [],
};

const WebsocketStore = signalStore(
  withState(initialState),
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
        return {
          date: message.date, messages: message.messages.map((message) => {
            if (message._id === state._id) message.text = state.text;
            return message;
          }),
        };
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
  })),
);

export default WebsocketStore;
