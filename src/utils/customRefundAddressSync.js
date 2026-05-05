// ─── CUSTOM REFUND ADDRESS SYNC ─────────────────────────────────────────────
// Encrypt + sign + POST the user's custom refund address to
// /v069/selfUser/encryptedCustomRefundAddress, and decrypt + signature-verify
// it back from GET /v069/selfUser. Mirrors pmSync.js so the saved refund
// address persists encrypted on the server (matching the mobile app).
// ─────────────────────────────────────────────────────────────────────────────

import {
  encryptPGPMessage,
  signPGPMessage,
  decryptPGPMessage,
  verifyDetachedSignature,
  derivePublicKeyArmored,
} from "./pgp.js";
import { fetchWithSessionCheck } from "./sessionGuard.js";
import { dispatchTamperDetected } from "./tamperGuard.js";

function isPGPMessage(v) {
  return typeof v === "string" && v.includes("-----BEGIN PGP MESSAGE-----");
}

// Encrypt + sign + POST the refund address.
// Returns true on success, false on any failure (logs a warning — never throws).
export async function syncCustomRefundAddressToServer({ address, label }, auth) {
  if (!auth?.pgpPrivKey) {
    console.warn("[RefundAddress Sync] No PGP key — cannot sync");
    return false;
  }
  try {
    const json = JSON.stringify({ address, label });

    const [encrypted, signature] = await Promise.all([
      encryptPGPMessage(json, auth.pgpPrivKey),
      signPGPMessage(json, auth.pgpPrivKey),
    ]);
    if (!encrypted) throw new Error("Encryption returned null");

    const payload = { encryptedCustomRefundAddress: encrypted };
    if (signature) payload.encryptedCustomRefundAddressSignature = signature;

    const v069Base = auth.baseUrl.replace(/\/v1$/, "/v069");
    const res = await fetchWithSessionCheck(`${v069Base}/selfUser/encryptedCustomRefundAddress`, {
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
    console.log("[RefundAddress Sync] ✓ Synced to server");
    return true;
  } catch (err) {
    console.warn("[RefundAddress Sync] Failed:", err.message);
    return false;
  }
}

// Decrypt + verify-signature the encryptedCustomRefundAddress field on a
// GET /v069/selfUser profile. Returns { address, label } on success, or
// null when the field is absent / decryption / signature verification fails.
export async function extractCustomRefundAddressFromProfile(profile, armoredPrivKey) {
  if (!profile || !armoredPrivKey) return null;
  const enc = profile.encryptedCustomRefundAddress;
  const sig = profile.encryptedCustomRefundAddressSignature;
  if (!isPGPMessage(enc)) return null;

  try {
    const plaintext = await decryptPGPMessage(enc, armoredPrivKey);
    if (!plaintext) {
      console.warn("[RefundAddress Sync] Decryption failed");
      return null;
    }
    if (sig) {
      const pubKey = await derivePublicKeyArmored(armoredPrivKey);
      const valid = await verifyDetachedSignature(plaintext, sig, pubKey);
      if (!valid) {
        console.warn("[RefundAddress Sync] Signature invalid — discarding");
        dispatchTamperDetected("custom refund address");
        // Self-heal: overwrite the tampered blob with a freshly-signed empty
        // payload so a malicious server can't replay the bad ciphertext.
        // Fire-and-forget — the user has already been alerted via the modal.
        const auth = window.__PEACH_AUTH__;
        if (auth?.pgpPrivKey && auth?.baseUrl && auth?.token) {
          syncCustomRefundAddressToServer({ address: null, label: null }, auth)
            .catch(err => console.warn("[RefundAddress Sync] Wipe failed:", err?.message));
        }
        return null;
      }
    }
    const data = JSON.parse(plaintext);
    return {
      address: typeof data?.address === "string" ? data.address : "",
      label:   typeof data?.label   === "string" ? data.label   : "",
    };
  } catch (err) {
    console.warn("[RefundAddress Sync] Extraction failed:", err.message);
    return null;
  }
}
