import {signalStore, withState} from '@ngrx/signals';

const messagesStore = signalStore(
  withState({}),
);

export default messagesStore;
