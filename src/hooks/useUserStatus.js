/**
 * useUserStatus — fetches GET /v1/user/{userId}/status with module-level caching.
 *
 * Powers the Repeat Trader badge. Response shape:
 *   { isBlocked: boolean, trades: number, badExperience: boolean }
 * where `trades` is the count of past trades between the current user and {userId}.
 *
 * Cached per userId for the lifetime of the page so multiple sites/rows showing
 * the same user only fetch once. Concurrent requests for the same userId are
 * de-duplicated. Silently returns null on error or when not authenticated.
 */
import { useEffect, useState } from "react";
import { useApi } from "./useApi.js";

const cache = new Map();      // userId -> { trades, badExperience, isBlocked }
const inflight = new Map();   // userId -> Promise<status>
const subscribers = new Map(); // userId -> Set<setState>

function notify(userId, value) {
  const subs = subscribers.get(userId);
  if (!subs) return;
  for (const fn of subs) fn(value);
}

export function useUserStatus(userId) {
  const { get, isLoggedIn, auth } = useApi();
  const ownId = auth?.peachId ?? null;
  const skip = !isLoggedIn || !userId || userId === ownId;

  const [status, setStatus] = useState(() => (skip ? null : (cache.get(userId) ?? null)));

  useEffect(() => {
    if (skip) {
      setStatus(null);
      return;
    }

    // Hit cache immediately
    if (cache.has(userId)) {
      setStatus(cache.get(userId));
      return;
    }

    let cancelled = false;

    // Subscribe so other components asking for the same userId get notified
    if (!subscribers.has(userId)) subscribers.set(userId, new Set());
    const subs = subscribers.get(userId);
    subs.add(setStatus);

    // De-dupe concurrent requests
    let promise = inflight.get(userId);
    if (!promise) {
      promise = (async () => {
        try {
          const res = await get(`/user/${userId}/status`);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const data = await res.json();
          const value = {
            trades: data?.trades ?? 0,
            badExperience: !!data?.badExperience,
            isBlocked: !!data?.isBlocked,
          };
          cache.set(userId, value);
          notify(userId, value);
          return value;
        } catch {
          // Cache null so we don't refetch on every render — silent fail matches existing pattern
          cache.set(userId, null);
          notify(userId, null);
          return null;
        } finally {
          inflight.delete(userId);
        }
      })();
      inflight.set(userId, promise);
    }

    promise.then((value) => {
      if (!cancelled) setStatus(value);
    });

    return () => {
      cancelled = true;
      subs.delete(setStatus);
      if (subs.size === 0) subscribers.delete(userId);
    };
  }, [userId, skip]); // eslint-disable-line react-hooks/exhaustive-deps

  return status;
}

/** Drop the in-memory cache (e.g. on logout). */
export function clearUserStatusCache() {
  cache.clear();
  inflight.clear();
  subscribers.clear();
}
