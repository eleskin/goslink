import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import User from '../../interfaces/user';

const initialState: User = {
  _id: '',
  name: '',
  username: '',
  email: '',
  conversationalist: '',
  conversationalistName: '',
  lastMessage: '',
};

const UserStore = signalStore(
  withState({user: initialState}),
  withMethods(({user, ...store}) => ({
    setUser(state: User = initialState) {
      patchState(store, {user: state});
    },
  })),
);

export default UserStore;
