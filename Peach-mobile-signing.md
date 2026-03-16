# Plan: Mobile-Assisted Bitcoin Signing via Pending Tasks

## Context

The Peach web app holds the user's PGP key but **never** the Bitcoin private keys (those stay on mobile). This blocks 4 features that need Bitcoin signatures:

1. **Rating** — `POST /v1/contract/:id/user/rate` needs Bitcoin message signature
2. **Sell offer creation** — escrow setup needs `escrowPublicKey` + `returnAddress` from mobile HD wallet
3. **Seller payment release** — needs signed PSBT (`releaseTransaction`)
4. **Refund flow** — needs signed PSBT for refund tx

### Confirmed architecture (from backend dev)

- JWT tokens have an `isDesktop` flag (`true` for browser, `false` for mobile)
- **Browser-exclusive endpoints**: create pending tasks (signing requests)
- **Mobile-exclusive endpoint**: `GET /pendingTasks` — returns list of tasks waiting to be signed
- **Mobile-exclusive endpoint**: submit the signature for a task
- **No QR code for signing** — mobile is already authenticated as the same user, server links them by userId
- **Server auto-applies the signature** — browser does NOT need to make a second API call after mobile signs. The server handles it (e.g., releases escrow, submits rating).
- **Push notification** sent to mobile when a new pending task is created
- **Auth handshake still uses QR** (separate system — user isn't logged in yet on browser)

---

## How it works

```
BROWSER (isDesktop=true)        PEACH SERVER                      MOBILE (isDesktop=false)
   |                                |                                |
   |  1. User clicks                |                                |
   |     "Release Bitcoin"          |                                |
   |                                |                                |
   |  2. POST /v1/task/create       |                                |
   |  (browser-exclusive)           |                                |
   |  { type, contractId, ... }     |                                |
   |------------------------------->|                                |
   |  { taskId }                    |                                |
   |<-------------------------------|                                |
   |                                |  3. Push notification →        |
   |                                |     "Signing request pending"  |
   |                                |------------------------------->|
   |                                |                                |
   |  4. Browser shows              |  5. GET /v1/pendingTasks       |
   |     "Waiting for mobile..."    |  (mobile-exclusive)            |
   |     + polls task status        |<-------------------------------|
   |                                |  [{ taskId, type, data... }]   |
   |                                |------------------------------->|
   |                                |                                |
   |                                |  6. Mobile shows confirmation, |
   |                                |     user approves, signs       |
   |                                |                                |
   |                                |  7. POST /v1/task/:id/sign     |
   |                                |  (mobile-exclusive)            |
   |                                |  { signature / signedPSBT }    |
   |                                |<-------------------------------|
   |                                |                                |
   |                                |  8. Server auto-applies:       |
   |                                |     releases escrow / submits  |
   |                                |     rating / processes refund  |
   |                                |                                |
   |  9. Poll detects completion    |                                |
   |  GET /v1/task/:id/status       |                                |
   |------------------------------->|                                |
   |  { status: "completed" }       |                                |
   |<-------------------------------|                                |
   |                                |                                |
   |  10. Browser updates UI:       |                                |
   |      "Bitcoin released!" /     |                                |
   |      "Rating submitted!"      |                                |
```

### Key simplifications vs our original QR-based design
- **No QR code** — server links browser and mobile by userId
- **No PGP encryption of responses** — server handles the signature directly, browser never sees it
- **No browser-side API call after signing** — server auto-applies the result
- **Browser just polls for task completion** — much simpler than decrypting relay responses
- **Push notifications** — user doesn't have to guess when to open mobile app

---

## What we know about the endpoints

Confirmed by backend dev (exact paths/shapes TBD — these are our best guess based on his description):

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /v1/task/create` | Desktop only (`isDesktop=true`) | Browser creates a signing task |
| `GET /v1/pendingTasks` | Mobile only (`isDesktop=false`) | Mobile fetches tasks to sign |
| `POST /v1/task/:id/sign` | Mobile only (`isDesktop=false`) | Mobile submits signature |
| `GET /v1/task/:id/status` | Desktop only (`isDesktop=true`) | Browser polls for completion |

### Task types (our expectation)

| Type | What browser sends | What mobile signs | Server auto-applies |
|------|-------------------|-------------------|---------------------|
| `releaseTransaction` | `{ type: "release", contractId }` | Signs the release PSBT with escrow key | Broadcasts release tx, completes contract |
| `refundTransaction` | `{ type: "refund", offerId }` | Signs the refund PSBT with escrow key | Broadcasts refund tx |
| `rateUser` | `{ type: "rate", contractId, rating: 1\|-1 }` | Bitcoin message signature over counterparty userId | Submits rating to contract |
| `escrowSetup` | `{ type: "escrow", offerId }` | Derives escrow keypair from offer | Registers escrow pubkey + return address on the offer |

---

## What we build now (steps 5.1–5.2)

### 1. `createTask()` helper — mock for now, real POST later

A simple async function added to `src/hooks/useApi.js`:

```js
// Mock mode: resolves immediately (the contract polling will detect the real change later)
// Real mode (when backend ready): POST /v1/task/create { type, ...payload }
async function createTask(post, type, payload) {
  // TODO: replace with real endpoint when backend confirms shape
  console.log('[createTask mock]', type, payload);
  return { taskId: 'mock-' + Date.now() };
}
```

### 2. `src/components/MobileSigningModal.jsx` — waiting overlay

Props: `{ open, title, description, onCancel }`

Reuse the existing `ConfirmModal` pattern from `trade-execution/components.jsx` (lines 720-770):
- `position: fixed; inset: 0; zIndex: 500`
- Background: `rgba(43,25,17,.6)`
- Animation: `modalIn .18s ease`

UI:
- Phone icon (SVG) + "Approve on your Peach mobile app" heading
- Description text (e.g., "A push notification has been sent to your phone")
- Animated spinner (reuse existing `@keyframes spin` from global.css)
- Cancel button

Styling: `const css` string, existing design tokens only.

### 3. Contract polling after task creation

**Important finding:** Contract status is NOT currently auto-polled — only chat polls every 5s. After creating a signing task, we need to poll the contract to detect when the mobile has signed and the server has applied the result.

Add a `useEffect` in `trade-execution/index.jsx` that:
- Activates when `showSigningModal === true`
- Polls `GET /contract/:id` every 3-5s
- Compares `liveContract.tradeStatus` to detect the change
- When status changes → close modal, update `liveContract`, stop polling
- Clean up interval on unmount or modal close

### 4. Integration into existing screens

**Rating** (`trade-execution/index.jsx` line ~953, `components.jsx` lines 1206-1257):
- Replace `onRate={(r) => console.log("rated:", r)}` with:
  ```js
  onRate={async (r) => {
    const rating = r === 5 ? 1 : -1;  // Map UI values to API values
    await createTask(post, "rate", { contractId: routeId, rating });
    setSigningModal({ title: "Sign Rating", description: "..." });
  }}
  ```
- Contract polling detects `rateUser` → `tradeCompleted` → close modal

**Seller release** (`trade-execution/index.jsx` lines 881-883):
- Replace `setActionError("Releasing Bitcoin requires...")` with:
  ```js
  await createTask(post, "release", { contractId: routeId });
  setSigningModal({ title: "Release Bitcoin", description: "..." });
  ```
- Contract polling detects `releaseEscrow` → `payoutPending` → close modal

**Refund** (`trade-execution/index.jsx` lines 855-857):
- Replace `setActionError("Refund requires...")` with:
  ```js
  await createTask(post, "refund", { contractId: routeId });
  setSigningModal({ title: "Refund Escrow", description: "..." });
  ```
- Contract polling detects refund status change → close modal

**Sell offer** (`offer-creation/index.jsx` line ~187):
- Deferred — sell offer flow needs more design (no existing polling, different screen). Wire the other 3 first.

---

## Auth handshake (separate system — still uses QR)

Auth is a different flow because the browser isn't logged in yet. It still follows the QR-based protocol from `peach-web-auth-analysis.md`:

1. Browser generates ephemeral PGP keypair (D1/D2)
2. Browser requests Desktop Connection from server (unauthenticated)
3. QR displayed with connection ID + D2 public key
4. Mobile scans, sends encrypted auth package via server
5. Browser polls, decrypts, validates
6. Server issues JWT with `isDesktop=true`

**Auth and signing are separate systems.** Auth uses QR (must — no existing session). Signing uses server-linked pending tasks (can — both sides already authenticated).

---

## What the mobile app needs

1. **Poll or receive push for `/pendingTasks`** — show pending tasks in-app
2. **Confirmation UI per task type** — human-readable summary ("Release 250,000 sats for contract X?")
3. **Sign + submit** — use existing signing code, POST result to `/v1/task/:id/sign`
4. **Reuse existing mobile signing code**:
   - `createUserRating.ts` for rating
   - `useConfirmPaymentSeller.tsx` for PSBT release
   - `useRefundSellOffer.tsx` for refund PSBT
   - `getPublicKeyForEscrow.ts` for escrow key derivation

---

## Security

- **Tasks bound to userId** — server creates task under the desktop token's userId, only the same userId's mobile can see/sign it
- **`isDesktop` flag in JWT** — prevents browser from calling mobile endpoints and vice versa
- **Mobile verifies independently** — mobile should fetch contract/offer details from server to cross-check task data
- **Server validates signature** — server applies the signature only if it's valid
- **TTL on tasks** — pending tasks expire after a reasonable window
- **Push notifications** — user is actively alerted, not relying on manual polling

---

## Implementation Sequence

| Step | What | Who | Effort |
|------|------|-----|--------|
| **5.1** | Build `MobileSigningModal` + `createTask` helper (with mock mode) | Web (us) | ~0.5 session |
| **5.2** | Wire all 4 features into existing screens | Web (us) | ~1 session |
| **5.3** | Implement server endpoints + push notifications | Backend team | ~2-3 sessions |
| **5.4** | Implement pending tasks UI + signing on mobile | Mobile team | ~2-3 sessions |
| **5.5** | End-to-end testing on regtest | All | ~1 session |

**We can build steps 5.1–5.2 now** with mock task responses, so it's ready when backend + mobile land. The browser work is very light — just one modal component + one POST call per feature.

---

## What we build now (this session)

### Step 1: `MobileSigningModal.jsx`
- New file: `src/components/MobileSigningModal.jsx`
- Phone icon SVG + spinner + title + description + cancel button
- Reuse ConfirmModal overlay pattern (fixed, z-500, backdrop blur)

### Step 2: Mock `createTask()` + state in trade execution
- Add mock `createTask()` in `src/hooks/useApi.js`
- Add `signingModal` state to `trade-execution/index.jsx`
- Add contract polling `useEffect` that activates when modal is open

### Step 3: Wire the 3 trade execution integration points
- `release_bitcoin` → createTask + show modal (lines 881-883)
- `refund_escrow` → createTask + show modal (lines 855-857)
- `onRate` → createTask + show modal (line 953)

### Step 4 (deferred): Sell offer — needs separate design pass

## Files to create
- `src/components/MobileSigningModal.jsx`

## Files to modify
- `src/hooks/useApi.js` — add mock `createTask()` helper
- `src/screens/trade-execution/index.jsx` — 3 action handlers + signing modal state + contract polling

## Open questions for backend dev (not blocking current work)
- Exact endpoint path and request/response shape for task creation
- Task types: are they the 4 we expect (release, refund, rate, escrow)?
- Does the mobile get the full signing data from `/pendingTasks`, or does it fetch it separately?

## Verification
1. `npm run dev` — app builds without errors
2. Navigate to a trade with `releaseEscrow` status → click "Release Bitcoin" → signing modal appears with phone icon + spinner
3. Navigate to a trade with `rateUser` status → click rating → signing modal appears
4. Cancel button closes the modal
5. When backend lands: swap mock `createTask()` for real POST, test end-to-end
