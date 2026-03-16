# Plan: Unified Relay Protocol — Mobile-Assisted Signing & Auth for Web

## Context

The Peach web app holds the user's PGP key but **never** the Bitcoin private keys (those stay on mobile). This blocks 4 features that need Bitcoin signatures:

1. **Rating** — `POST /v1/contract/:id/user/rate` needs Bitcoin message signature
2. **Sell offer creation** — escrow setup needs `escrowPublicKey` + `returnAddress` from mobile HD wallet
3. **Seller payment release** — needs signed PSBT (`releaseTransaction`)
4. **Refund flow** — needs signed PSBT for refund tx

Additionally, the **Desktop Auth handshake** (QR scan to log in) uses the same relay pattern.

**Approach: Design one unified relay system (`/v1/relay/*`) that handles both auth and signing. Build the signing type first.** Auth slots in later when its protocol is confirmed by the backend team. This avoids duplicating infrastructure while keeping signing independent of unresolved auth decisions.

---

## Can any of these SKIP the relay?

| Feature | Can skip? | Why |
|---------|-----------|-----|
| **Rating** | Maybe | The mobile signs `sha256(counterpartyUserId)` with ECDSA. If the backend team adds PGP signature support as an alternative, this works without relay. **Ask backend first.** |
| **Buyer payment confirm** | Partially | Already works if the contract has a `releaseAddress` set from mobile. Only needs relay for "set payout address on the fly" case. |
| **Sell offer creation** | No | Escrow public key must come from HD wallet. No alternative. |
| **Seller release** | No | PSBT must be signed with escrow private key. No alternative. |
| **Refund** | No | Same as above — PSBT signing required. |

---

## Protocol Flow (Signing — built first; auth uses same relay later)

```
BROWSER                         PEACH SERVER                      MOBILE APP
   |                                |                                |
   |  1. POST /v1/relay/request      |                                |
   |  { type:"sign:rate",           |
   |    payload, pgpPubKey }        |                                |
   |------------------------------->|                                |
   |  { requestId, expiresAt }      |                                |
   |<-------------------------------|                                |
   |                                |                                |
   |  2. Display QR code            |                                |
   |  { v:1, t:"sign", r:requestId }|                                |
   |                                |                                |
   |                                |  3. Mobile scans QR,           |
   |                                |     fetches request details    |
   |                                |  GET /v1/relay/request/:id     |
   |                                |<-------------------------------|
   |                                |  { type, payload, pgpPubKey }  |
   |                                |------------------------------->|
   |                                |                                |
   |                                |  4. Mobile shows confirmation, |
   |                                |     user approves, mobile signs|
   |                                |                                |
   |                                |  5. POST /v1/relay/:id/response|
   |                                |  { encryptedResponse } (PGP)   |
   |                                |<-------------------------------|
   |                                |                                |
   |  6. Poll GET /v1/relay/         |                                |
   |     request/:id/response       |                                |
   |  → { encryptedResponse }       |                                |
   |<-------------------------------|                                |
   |                                |                                |
   |  7. Decrypt + complete API call|                                |
```

- **QR payload is small**: `{ "v": 1, "t": "sign", "r": "uuid" }` — the mobile fetches the full request (including browser PGP key) from the server
- **5-minute TTL** on signing requests (30s for auth type, when implemented)
- **Response is PGP-encrypted** for the browser's public key — server cannot read it
- **Polling every 2s** from browser
- **Same relay endpoints** will handle auth type in the future — mobile routes by `t` field in QR

---

## Unified Relay Endpoints (4 endpoints)

These don't exist yet — **this is a spec for the backend team**. One relay system handles both signing and future auth.

### `POST /v1/relay/request` (auth: desktop token, or unauthenticated for auth type)
Create a relay request. Body:
```json
{
  "type": "sign:rate | sign:releasePsbt | sign:escrowSetup | sign:refund | auth:desktop",
  "payload": { ... },
  "pgpPublicKey": "armored PGP public key (browser's key for encryption)"
}
```
Returns: `{ requestId, expiresAt }`

- **Signing types** (`sign:*`): require desktop auth token. Payload contains signing-specific data.
- **Auth type** (`auth:desktop`): no auth token needed (user isn't logged in yet). `pgpPublicKey` is the ephemeral D2 key from the auth handshake.
- TTL: 5 minutes for signing, 30 seconds for auth (as per auth spec).

### `GET /v1/relay/request/:id` (auth: mobile token)
Fetch request details. For signing types, server verifies same userId. For auth type, any authenticated mobile user can fetch (they verify identity visually). Returns: `{ type, payload, pgpPublicKey, expiresAt }`

### `POST /v1/relay/request/:id/response` (auth: mobile token)
Submit response, PGP-encrypted for the requester's public key. Body: `{ encryptedResponse }`

### `GET /v1/relay/request/:id/response` (auth: desktop token, or session-bound for auth)
Requester polls this. Returns: `{ status: "pending" | "completed" | "expired", encryptedResponse? }`

### Unified QR format
```json
{ "v": 1, "t": "sign", "r": "request-uuid" }   // Signing
{ "v": 1, "t": "auth", "r": "request-uuid" }    // Auth (future)
```
Mobile scanner checks `t` field and routes to the correct flow.

---

## How Auth Will Use the Same Relay (Future)

When the auth protocol is confirmed, it slots into the same system:

1. Browser generates ephemeral PGP keypair (D1/D2) — no auth token yet
2. `POST /v1/relay/request` with `type: "auth:desktop"`, `pgpPublicKey: D2` — unauthenticated
3. QR: `{ "v": 1, "t": "auth", "r": "request-uuid" }`
4. Mobile scans, fetches request, creates PACKAGE_1 (encrypted for D2) with xpub + PGP key + PMs
5. `POST /v1/relay/request/:id/response` with encrypted PACKAGE_1
6. Browser polls, decrypts PACKAGE_1 with D1, shows confirmation, sends ValidationPassword
7. Server validates → issues auth token

**Key differences from signing:**
- Auth requests are **unauthenticated** (user isn't logged in yet)
- TTL is **30 seconds** (not 5 minutes)
- QR contains `"t": "auth"` instead of `"t": "sign"`
- Any mobile user can fetch auth requests (identity verified visually, not by userId)
- Response payload is much larger (xpub, PGP key, PMs vs a single signature)

**No changes needed to relay endpoints** — the `type` field distinguishes the flows, and the server applies different validation rules per type.

---

## What We Build on the Web Side

### 1. `src/hooks/useSigningRelay.js` — signing lifecycle hook

```js
const {
  requestSign,  // (type, payload) => starts the flow
  status,       // "idle" | "waiting" | "complete" | "error" | "expired"
  qrData,       // JSON string for QR code
  result,       // decrypted signing result
  error,        // error message
  reset,        // clear state
  cancel,       // stop polling
} = useSigningRelay();
```

Internal flow:
1. `requestSign()` → POST to server → get requestId → derive PGP pubkey from `auth.pgpPrivKey` → set qrData → start polling
2. Poll every 2s → on response → decrypt with `decryptPGPMessage()` → set result
3. On 5min timeout → set expired

### 2. `src/components/SigningModal.jsx` — reusable modal

Props: `{ type, payload, title, description, onComplete, onCancel }`

UI states:
- **Waiting**: QR code + "Scan with Peach mobile app" + countdown ring + cancel button
- **Complete**: Green checkmark → auto-close after 1.5s → calls `onComplete(result)`
- **Expired**: "QR expired" + retry button
- **Error**: Error message + retry button

QR rendering: reuse existing `qrcodejs` CDN pattern from `trade-execution/components.jsx`

Styling: `const css` string, existing design tokens only

### 3. Integration into existing screens

**Rating** (`trade-execution/index.jsx`):
- `RatingPanel.onRate` → open `SigningModal` type="rate"
- On complete → `POST /contract/:id/user/rate` with `{ rating: 1|-1, signature }`

**Seller release** (`trade-execution/index.jsx`):
- Replace the "requires mobile" error message at `action === "release_bitcoin"`
- Open `SigningModal` type="releasePsbt" with contract's PSBT data
- On complete → `POST /contract/:id/payment/confirm` with `{ releaseTransaction }`

**Refund** (`trade-execution/index.jsx`):
- Fetch unsigned PSBT from `GET /offer/:id/refundPsbt`
- Open `SigningModal` type="refund"
- On complete → `POST /offer/:id/refund` with `{ tx: signedTxHex }`

**Sell offer** (`offer-creation/index.jsx`):
- Before submitting sell offer, open `SigningModal` type="escrowSetup"
- Mobile derives escrow keypair, returns `{ escrowPublicKey, returnAddress }`
- Browser submits `POST /v069/sellOffer` with those values

---

## What the Mobile App Needs

1. **Extend QR scanner** — detect `"t": "sign"` and route to signing flow (vs auth flow)
2. **Fetch request** — `GET /v1/relay/request/:id` to get type + payload + browser PGP key
3. **Confirmation UI per type** — show human-readable summary of what's being signed
4. **Sign + encrypt + upload** — perform Bitcoin signing, encrypt result for browser's PGP key, POST response
5. **Reuse existing mobile signing code**:
   - `createUserRating.ts` for rating
   - `useConfirmPaymentSeller.tsx` for PSBT release
   - `useRefundSellOffer.tsx` for refund PSBT
   - `getPublicKeyForEscrow.ts` for escrow key derivation

---

## Security

- **PGP-encrypted responses** — server relays but can't read the signature
- **Request bound to userId** — only the same user's mobile can fetch/respond
- **5-minute TTL** — stale requests expire
- **Mobile verifies independently** — mobile fetches contract/offer details from server to cross-check the payload, not trusting browser blindly
- **Browser signs the payload** — PGP signature over the request payload so mobile can verify it wasn't tampered with in transit
- **Rate limiting** — max 5 active signing requests per user

---

## Implementation Sequence

| Step | What | Who | Effort |
|------|------|-----|--------|
| **5.1** | Build `useSigningRelay` hook + `SigningModal` component (with mock responses for testing) | Web (us) | ~1 session |
| **5.2** | Wire rating — first ask backend if PGP sig works; if not, integrate SigningModal | Web (us) | ~0.5 session |
| **5.3** | Wire seller release + refund into SigningModal | Web (us) | ~0.5 session |
| **5.4** | Wire sell offer creation into SigningModal | Web (us) | ~0.5 session |
| **5.5** | Implement 4 server endpoints | Backend team | ~2-3 sessions |
| **5.6** | Implement "Scan to Sign" on mobile | Mobile team | ~2-3 sessions |
| **5.7** | End-to-end testing on regtest | All | ~1 session |

**We can build steps 5.1–5.4 now** (browser side) with mock server responses, so it's ready to go when the backend + mobile pieces land.

---

## Files to Create
- `src/hooks/useSigningRelay.js`
- `src/components/SigningModal.jsx`

## Files to Modify
- `src/screens/trade-execution/index.jsx` — rating, seller release, refund handlers
- `src/screens/trade-execution/components.jsx` — RatingPanel signing state
- `src/screens/offer-creation/index.jsx` — sell offer submission flow

## Verification
1. Build `useSigningRelay` + `SigningModal` with a mock mode that simulates server responses
2. Click "Rate" → see QR modal → mock response returns → rating API call fires
3. Click "Release Bitcoin" → see QR modal → mock response → payment confirm fires
4. Submit sell offer → see QR modal → mock response → sell offer API call fires
5. When backend + mobile are ready: end-to-end test on regtest
