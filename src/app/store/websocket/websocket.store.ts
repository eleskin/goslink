import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

const WebsocketStore = signalStore(
  withState({
    readyState: 0,
    contactId: '',
    rooms: [],
    searchedUser: null,
    contact: null,
    messages: [],
  }),
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
    deleteRoom(state = '') {
      const rooms = store.rooms().filter((room: any) => room._id !== state);
      patchState(store, {rooms});
    }
  })),
);

export default WebsocketStore;
