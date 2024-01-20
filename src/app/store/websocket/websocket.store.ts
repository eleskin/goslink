import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';
import Chat from '../../interfaces/chat';

type WebsocketState = {
  readyState: number,
  contactId: string,
  chats: Chat[],
  searchedUser: Chat | undefined,
  contact: User | undefined,
  onlineUsers: string[],
};

const initialState: WebsocketState = {
  readyState: 0,
  contactId: '',
  chats: [],
  searchedUser: undefined,
  contact: undefined,
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
    setChats(state = []) {
      patchState(store, {chats: state});
    },
    setSearchedUser(state = null) {
      patchState(store, {searchedUser: state});
    },
    setContact(state = null) {
      patchState(store, {contact: state});
    },
    deleteChat(state = '') {
      const chats = store.chats().filter((chat: any) => chat._id !== state);
      patchState(store, {chats});
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
