import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import Room from '../../interfaces/room';

const initialState: Room[] = [];

const RoomsStore = signalStore(
  withState({
    rooms: initialState,
    currentRoomId: '',
  }),
  withMethods(({...store}) => ({
    setRooms(state: Room[] = initialState) {
      patchState(store, {rooms: state});
    },
    setCurrentRoomId(state = '') {
      patchState(store, {currentRoomId: state});
    },
  })),
);

export default RoomsStore;
