import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

const WebsocketStore = signalStore(
  withState({
    readyState: 0,
    contactId: '',
  }),
  withMethods(({...store}) => ({
    setReadyState(state = 0) {
      patchState(store, {readyState: state});
    },
    setContactId(state = '') {
      patchState(store, {contactId: state});
    },
  })),
);

export default WebsocketStore;
