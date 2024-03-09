import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

const initialState = {
  mouseX: -1,
  mouseY: -1,
};

const InterfaceStore = signalStore(
  withState(initialState),
  withMethods(({...store}) => ({
    setMenuCoordinates(state = initialState) {
      patchState(store, {mouseX: state.mouseX, mouseY: state.mouseY})
    }
  })),
);

export default InterfaceStore;
