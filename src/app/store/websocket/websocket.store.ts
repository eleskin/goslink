import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';

const WebsocketStore = signalStore(
  withState({
    readyState: 0,
    contactId: '',
    rooms: [],
    searchedUser: null,
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
    }
  })),
);

export default WebsocketStore;
