import { fetchWithSessionCheck } from "./sessionGuard.js";

// Authoritative check for "did this v069 offer become a contract for me?"
// Mirrors mobile's hasSellOfferTurnedToMyContract / hasBuyOfferTurnedToMyContract.
//
// Returns tri-state:
//   { accepted: true,  contractId: string | null } — yes, it's now a contract
//   { accepted: false, contractId: null }          — endpoint says no contract
//   { accepted: null,  contractId: null }          — error / unknown; caller should retry
export async function hasOfferTurnedToMyContract(offerId, offerType, auth) {
  if (!auth?.baseUrl || !auth?.token || offerId == null) {
    return { accepted: null, contractId: null };
  }
  const v069Base = auth.baseUrl.replace(/\/v1$/, "/v069");
  const path = offerType === "buyOffer" ? "buyOffer" : "sellOffer";
  try {
    const res = await fetchWithSessionCheck(
      `${v069Base}/${path}/${offerId}/hasTurnedToMyContract`,
      { headers: { Authorization: `Bearer ${auth.token}` } },
    );
    if (!res || !res.ok) return { accepted: null, contractId: null };
    const body = await res.json().catch(() => null);
    if (!body) return { accepted: null, contractId: null };
    return {
      accepted: body.success === true,
      contractId: body.contract?.id ?? null,
    };
  } catch {
    return { accepted: null, contractId: null };
  }
}
