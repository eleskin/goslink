import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

const WebsocketStore = signalStore(
  withState({
    readyState: 0,
  }),
  withMethods(({...store}) => ({
    setReadyState(state = 0) {
      patchState(store, {readyState: state});
    },
  })),
);

export default WebsocketStore;
