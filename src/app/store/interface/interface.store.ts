import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

type Actions = {text: string; function: () => void}[];

type InterfaceState = {
  mouseX: number;
  mouseY: number;
  actions: Actions;
}

const initialState: InterfaceState = {
  mouseX: -1,
  mouseY: -1,
  actions: [],
};

const InterfaceStore = signalStore(
  withState(initialState),
  withMethods(({...store}) => ({
    setMenuCoordinates(state = initialState) {
      patchState(store, {mouseX: state.mouseX, mouseY: state.mouseY});
    },
    setActions(state: Actions = initialState.actions) {
      patchState(store, {actions: state});
    },
  })),
);

export default InterfaceStore;
