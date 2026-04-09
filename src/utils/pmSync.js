// ─── PM SYNC ─────────────────────────────────────────────────────────────────
// Encrypt and push the user's payment methods to the server via
// POST /v069/selfUser/encryptedPaymentData. Shared by the Payment Methods
// screen and the Offer Creation screen so that a PM added from either place
// persists identically.
// ─────────────────────────────────────────────────────────────────────────────

import { encryptPGPMessage, signPGPMessage } from "./pgp.js";
import { fetchWithSessionCheck } from "./sessionGuard.js";

// Convert internal PM array → API object-map format.
// Internal shape: { id, methodId, name, currencies, details:{..., _payRefType, _payRefCustom} }
// API shape:      { [id]: { id, label, currencies, ...flatDetails } }
export function serializePMs(pms) {
  const map = {};
  for (const pm of pms) {
    const { details = {}, ...rest } = pm;
    const apiDetails = {};
    for (const [k, v] of Object.entries(details)) {
      if (k.startsWith("_")) continue;
      apiDetails[k] = v;
    }
    if (apiDetails.username && !apiDetails.userName) {
      apiDetails.userName = apiDetails.username;
      delete apiDetails.username;
    }
    if (apiDetails.holder && !apiDetails.beneficiary) {
      apiDetails.beneficiary = apiDetails.holder;
      delete apiDetails.holder;
    }
    if (apiDetails.email && apiDetails.userName && apiDetails.email === apiDetails.userName) {
      delete apiDetails.email;
    }
    map[pm.id] = {
      id: pm.id,
      label: pm.name,
      currencies: pm.currencies || [],
      ...apiDetails,
    };
  }
  return map;
}

// Encrypt the PM map with the user's own PGP key and POST it to the server.
// Returns true on success, false on any failure (logs a warning — never throws).
export async function syncPMsToServer(pms, auth) {
  if (!auth?.pgpPrivKey) {
    console.warn("[PM Sync] No PGP key — cannot sync");
    return false;
  }
  try {
    const apiMap = serializePMs(pms);
    const json = JSON.stringify(apiMap);
    console.log("[PM Sync] Serialised PM map:", apiMap);

    const [encrypted, signature] = await Promise.all([
      encryptPGPMessage(json, auth.pgpPrivKey),
      signPGPMessage(json, auth.pgpPrivKey),
    ]);
    if (!encrypted) throw new Error("Encryption returned null");

    const payload = { encryptedPaymentData: encrypted };
    if (signature) payload.encryptedPaymentDataSignature = signature;

    const v069Base = auth.baseUrl.replace(/\/v1$/, "/v069");
    const res = await fetchWithSessionCheck(`${v069Base}/selfUser/encryptedPaymentData`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${res.status} ${body}`);
    }
    console.log("[PM Sync] ✓ Synced to server");
    return true;
  } catch (err) {
    console.warn("[PM Sync] Failed:", err.message);
    return false;
  }
}
