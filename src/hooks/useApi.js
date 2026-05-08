/**
 * useApi — shared API helper for all Peach screens.
 *
 * Returns get / post / patch helpers that automatically:
 *   - Route to auth.baseUrl when window.__PEACH_AUTH__ is set, or to the
 *     build-time API_V1 (VITE_API_URL + /v1) otherwise.
 *   - Attach the Bearer token header when logged in.
 *
 * Usage:
 *   const { get, post, patch, put, del, auth, isLoggedIn } = useApi();
 *   const res = await get('/market/prices');
 *   const res = await post('/offer/search', { type: 'bid' });
 *   const res = await patch('/user', { payoutAddress: addr });
 *   const res = await put('/user/abc123/block');
 *   const res = await del('/offer/match', { matchOfferId: '...' });
 */

import { fetchWithSessionCheck } from '../utils/sessionGuard.js';
import { API_V1 } from '../utils/network.js';

// ── In-memory cache (survives navigation, cleared on page refresh) ──
if (!window.__PEACH_CACHE__) window.__PEACH_CACHE__ = {};

/** Get cached entry. Returns { data, ts } or null. */
export function getCached(key) {
  return window.__PEACH_CACHE__[key] ?? null;
}

/** Store data with current timestamp. */
export function setCache(key, data) {
  window.__PEACH_CACHE__[key] = { data, ts: Date.now() };
}

/** Clear one key or the entire cache. */
export function clearCache(key) {
  if (key) delete window.__PEACH_CACHE__[key];
  else window.__PEACH_CACHE__ = {};
}

export function useApi() {
  const auth = window.__PEACH_AUTH__ ?? null;
  const base = auth?.baseUrl ?? API_V1;
  const authHeaders = auth ? { Authorization: `Bearer ${auth.token}` } : {};

  return {
    auth,
    isLoggedIn: !!auth,

    get(path) {
      return fetchWithSessionCheck(`${base}${path}`, { headers: authHeaders });
    },

    post(path, body) {
      return fetchWithSessionCheck(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(body),
      });
    },

    patch(path, body) {
      return fetchWithSessionCheck(`${base}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(body),
      });
    },

    put(path, body) {
      return fetchWithSessionCheck(`${base}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    del(path, body) {
      return fetchWithSessionCheck(`${base}${path}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(body),
      });
    },
  };
}
