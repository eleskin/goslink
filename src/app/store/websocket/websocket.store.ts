import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

const WebsocketStore = signalStore(
  withState({
    readyState: 0,
    contactId: '',
    rooms: [],
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
  })),
);

export default WebsocketStore;
