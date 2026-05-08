// Helpers for the "create mobile action" deep-link flow.
// When the user is on a phone and has triggered a pending action on the
// server, we offer a "Open Peach App" button that deep-links into the app
// with `?type=<context>&id=<actionId>` so the app can handle it directly.

import { MOBILE_APP_SCHEME } from "./network.js";

export const IS_PHONE =
  typeof navigator !== "undefined" &&
  typeof window !== "undefined" &&
  (/iPhone|iPod/.test(navigator.userAgent) ||
    /Android.*Mobile/i.test(navigator.userAgent)) &&
  window.innerWidth <= 1024;

// type ∈ "fundEscrow" | "fundEscrowContract" | "refundEscrow"
//      | "refundEscrowContract" | "paymentMade" | "paymentConfirmed"
//      | "fundEscrowMultiple"  (no id required for fundEscrowMultiple)
export function buildMobileActionDeepLink(type, id) {
  const params = new URLSearchParams({ type });
  if (id != null) params.set("id", String(id));
  return `${MOBILE_APP_SCHEME}://mobileAction?${params.toString()}`;
}
