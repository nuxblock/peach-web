// Helpers for the "create mobile action" deep-link flow.
// When the user is on a phone and has triggered a pending action on the
// server, we offer a "Open Peach App" button that deep-links into the app
// with `?type=<context>&id=<actionId>` so the app can handle it directly.

export const IS_PHONE =
  typeof navigator !== "undefined" &&
  (/iPhone|iPod/.test(navigator.userAgent) ||
    /Android.*Mobile/i.test(navigator.userAgent));

// type ∈ "fundEscrow" | "fundEscrowContract" | "refundEscrow"
//      | "refundEscrowContract" | "paymentMade" | "paymentConfirmed"
//      | "fundEscrowMultiple"  (no id required for fundEscrowMultiple)
export function buildMobileActionDeepLink(type, id) {
  const params = new URLSearchParams({ type });
  if (id != null) params.set("id", String(id));
  return `peachbitcoinregtest://mobileAction?${params.toString()}`;
}
