import endpoints from './endpoints.json';
import { createQueryString } from './params';
import {
  deleteFromStorage,
  retrieveFromStorage,
  storeInStorage,
} from './storage';
import actions from '../store/actions/auth';

/**
 * Get a nonce value from our API server.
 *
 * @returns {Promise<string>} - A Promise that resolves to the nonce value
 */
export async function getNonce() {
  const res = await fetch('http://localhost:5000/auth/nonce');

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.text();
}

/**
 * Request authentication from GitHub.
 *
 * @param {object} opts - Options to help form the authentication request. The
 * most important one is 'state' which is the nonce value used to mitigate CSRF
 * attacks.
 *
 * @returns {Promise<void>}
 */
export async function requestAuthentication(opts) {
  cleanUpAuthStorage();

  // ---------- Nonce ---------- //

  const state = await getNonce();
  storeInStorage('authState', state);

  // ---------- Authentication query string ---------- //

  const queryObj = {};

  // Generic parameters that are required for all providers and are the same for
  // all authentication requests
  queryObj.client_id = endpoints.client_id;
  queryObj.redirect_uri = endpoints.redirect_uri;

  // Parameters that vary between authentication requests
  queryObj.state = state;
  queryObj.scope = opts.scope;

  const queryString = createQueryString(queryObj);

  // ---------- Direct to authentication endpoint ---------- //

  // Store the current page so the user can be re-directed correctly upon
  // successful authentication
  storeInStorage('authPreAuthPage', window.location.pathname);

  // Direct the user to the authentication endpoint
  window.location.href = `${endpoints.authEndpoint}?${queryString}`;
}

/**
 * Request access token from GitHub. The request actually goes through our
 * API server before hitting the provider's authentication endpoint.
 *
 * @param {object} config - A config object containing necessary information for
 * our API server to derive the appropriate access token request. This include
 * providing the authentication provider's name, the authentication code
 * received in step #1, and the authentication state. This is also the last time
 * the authentication state will be used in the authentication flow.
 * @param dispatch - A dispatch function to modify the state store when the
 * access token response is received.
 *
 * @returns {Promise<void>} - Will return a Promise as this is an async
 * function, but the Promise wont' resolve to anything.
 */
export async function requestAccessToken({ code, state }, dispatch) {
  // Compare state
  if (retrieveFromStorage('authState') !== state) {
    throw new Error('The provided state value does not match what was stored.');
  }

  // ---------- Request token ---------- //

  const tokenRes = await fetch('http://localhost:5000/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'github',
      code,
      state,
    }),
  });

  // ---------- Handle response ---------- //

  if (!tokenRes.ok) {
    cleanUpAuthStorage();

    throw new Error(await tokenRes.text());
  }

  const tokenDetails = await tokenRes.json();

  // We no longer need the state (nonce) value in our authentication flow.
  deleteFromStorage('authState');

  dispatch({
    type: actions.UPDATE_TOKENS,
    payload: tokenDetails,
  });
}

/**
 * Clean up local storage. This should be performed whenever an authentication
 * cycle is complete (or aborted).
 */
function cleanUpAuthStorage() {
  deleteFromStorage('authState');
  deleteFromStorage('authProvider');
  deleteFromStorage('authPreAuthPage');
}
