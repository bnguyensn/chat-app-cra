import { createStore, combineReducers } from 'redux';
import authReducers, { defaultAuthState } from './auth/reducers';

const defaultAppState = {
  auth: defaultAuthState,
};

const rootReducer = combineReducers({
  authReducers,
});

const store = createStore(rootReducer, defaultAppState);

export default store;
