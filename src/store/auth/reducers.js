import authActions from './actions';

export const defaultAuthState = {
  // Contain things like access token. This is available after a successful
  // authentication process.
  tokens: null,

  // Contain user details (e.g. names, avatar URL, etc.). This is available via
  // calling the API with the authentication tokens obtained above.
  user: null,

  // Contain status and status messages on the authentication process.
  // Available statuses (status messages should reflect these):
  // fetching / cancelled / failed | tokens / user
  status: null,
  statusText: '',
};

function updateAccessToken(state, action) {
  return {
    ...state,
    tokens: action.payload,
  };
}

function updateUser(state, action) {
  return {
    ...state,
    user: action.payload,
  };
}

export default function authReducers(state = defaultAuthState, action) {
  switch (action.type) {
    case authActions.UPDATE_TOKENS:
      return updateAccessToken(state, action);
    case authActions.UPDATE_USER:
      return updateUser(state, action);
    default:
      return state;
  }
}
