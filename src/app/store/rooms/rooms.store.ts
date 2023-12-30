import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Room from '../../interfaces/room';

const initialState: Room[] = [];

const RoomsStore = signalStore(
  withState({
    rooms: initialState,
  }),
  withMethods(({...store}) => ({
    setRooms(state: Room[] = initialState) {
      patchState(store, {rooms: state});
    },
  })),
);

export default RoomsStore;
