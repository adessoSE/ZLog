import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import { reducer } from '../reducer';
import { loadState, saveState } from './localStorage';
import { optimizeStateForSaving } from './optimizeStateForSaving';
import { cancelRequestsMiddleware } from './cancelRequestsMiddleware';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk, cancelRequestsMiddleware));

const persistedState = loadState();

const store = createStore(reducer, persistedState, enhancer);

/**
 * stores (optimized) state to localStorage, but at most every 1500 ms.
 */
store.subscribe(
  throttle(() => {
    const state = optimizeStateForSaving(store.getState());
    saveState(state);
  }, 1500)
);

export default store;
