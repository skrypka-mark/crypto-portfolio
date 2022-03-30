import { createStore } from 'redux';
import { loadState, saveState } from '../localStorage';
import rootReducer from './reducers';

const persistedState = loadState();
export const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    saveState(store.getState());
});
