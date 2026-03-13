# Peach Web — Backlog

Everything that needs to be built, wired, or fixed. Organized by priority phase.

**Constraint:** No Bitcoin private key operations in the browser (those stay on mobile). The browser has the user's PGP private key, so all PGP encryption/decryption/signing works.

---

## Already done

These are completed and kept for reference.

- ✅ **Buy offer submission** — wired via `POST /v069/buyOffer` (`offer-creation/index.jsx`)
- ✅ **Trade request acceptance** — both v069 trade requests and v1 system matches, full PGP crypto (`trades-dashboard/index.jsx`)
- ✅ **PM fetch** — `GET /v069/selfUser`, PGP-decrypted client-side. Same pattern in offer-creation, market-view, payment-methods.
- ✅ **PM save/sync** — `POST /v069/selfUser/encryptedPaymentData` with encrypted + signed payload. Persists across refresh.
- ✅ **Transaction Batching** — toggle calls `PATCH /user/batching` (`peach-settings.jsx`)
- ✅ **Refund Address** — CONFIRM calls `PATCH /user` (refundAddress) (`peach-settings.jsx`)
- ✅ **Custom Payout Wallet** — CONFIRM calls `PATCH /user` (payoutAddress) (`peach-settings.jsx`)
- ✅ **1.1 Extend Payment Deadline** — `PATCH /contract/:id/extendTime`. Also added seller "Give More Time" + "Cancel Trade" sliders for paymentTooLate status, and buyer "not paid on time" view. (`trade-execution/index.jsx`)
- ✅ **1.2 Buyer Payment Confirmation** — `POST /contract/:id/payment/confirm` with empty body. Shows fallback error if payout address needed. Seller release shows "requires mobile signing relay" message. (`trade-execution/index.jsx`)
- ✅ **1.3 Chat Send + Decrypt** — `POST /contract/:id/chat` with `encryptSymmetric` + detached `signPGPMessage`. Symmetric key decrypted from contract, used for both send encryption and receive decryption. Optimistic UI. (`trade-execution/index.jsx`)
- ✅ **1.4 Chat Pagination + Mark Read + Polling** — `GET /contract/:id/chat?page=N` with auto-load on scroll-to-top, deduplication, chronological sort. `POST /contract/:id/chat/received` marks unread messages. 5s polling for real-time incoming messages. (`trade-execution/index.jsx`)
- ✅ **1.5 Dispute Submission** — `POST /contract/:id/dispute` with role-aware reasons (buyer/seller), conditional form (noPayment needs email+message, others submit immediately). Encrypts symmetric key + both payment data fields for platform PGP key via `encryptForPublicKey`. Decrypts PM fields with symmetric-then-asymmetric fallback. (`trade-execution/index.jsx`, `pgp.js`)
- ✅ **1.6 Dispute Acknowledgment + Outcome** — `DisputeBanner` component handles 3 states: counterparty dispute with email input (`POST /contract/:id/dispute/acknowledge`), active dispute info banner, and outcome display with acknowledge button (`POST /contract/:id/dispute/acknowledgeOutcome`). Supports all 5 mediator outcomes (buyerWins, sellerWins, none, cancelTrade, payOutBuyer). Payment deadline timer hidden during dispute. (`trade-execution/index.jsx`)

---

## Phase 1: Wire Core Trade Actions (P0) ✅ COMPLETE

~~1.1 Extend Payment Deadline~~ ✅
~~1.2 Buyer Payment Confirmation~~ ✅
~~1.3 Chat Send with PGP Encryption~~ ✅
~~1.4 Chat Pagination + Mark Read~~ ✅
~~1.5 Dispute Submission~~ ✅
~~1.6 Dispute Acknowledgment + Outcome~~ ✅

---

## Phase 2: Contract Lifecycle Completion

### 2.1 Contract Cancellation Flow
- **File**: `src/screens/peach-trade-execution.jsx`
- **Endpoints**:
  - `POST /v1/contract/:id/cancel` (request cancellation)
  - `POST /v1/contract/:id/confirmCancelation` (accept counterparty's cancel request)
  - `POST /v1/contract/:id/rejectCancelation` (reject cancel request)
- **UI**: Add cancel button in trade execution, show cancel request notification if counterparty requested

### 2.2 Unread Message Counts
- **File**: `src/screens/peach-trades-dashboard.jsx`
- **Data source**: Contract summaries already include `unreadMessages` count
- **Implementation**: Use the count from `GET /v1/contract/summaries` to populate badge (currently hardcoded to 0)
- **Also**: Trade History tab badge should turn orange if any completed trade has unread chat messages

### 2.3 Rating
- **File**: `src/screens/peach-trade-execution.jsx` → `RatingPanel`
- **Endpoint**: `POST /v1/contract/:id/rate`
- **Body**: `{ rating: 1|-1, signature }`
- **Question**: Mobile app uses Bitcoin message signature. Check if PGP signature is accepted. If Bitcoin sig required → move to Phase 5 (mobile-assist).

### 2.4 Seller Payment Confirmation / Release
- **File**: `src/screens/peach-trade-execution.jsx`
- **Note**: "I've received the payment" slider logs to console. Wire to the release endpoint.
- **Likely requires signing relay (Phase 5)** — seller must sign a release transaction (PSBT).

---

## Phase 3: Offer Management Completion

### 3.1 Trade Request Rejection
- **File**: `src/screens/peach-trades-dashboard.jsx`
- **Endpoints**:
  - `POST /v069/buyOffer/:id/rejectTradeRequest`
  - `POST /v069/sellOffer/:id/rejectTradeRequest`
- **UI**: Add "Reject" button next to "Accept" on match cards

### 3.2 Offer Edit / Withdraw
- **File**: `src/screens/peach-market-view.jsx` (offer detail popup for own offers)
- **Endpoints**:
  - `PATCH /v1/offer/:id` (edit premium, PMs, online status)
  - `DELETE /v1/offer/:id` (cancel/withdraw offer)
  - `DELETE /v069/buyOffer/:id` (cancel v069 buy offer)
- **UI**: Add edit/withdraw buttons to offer detail popup when `offer.user === self`
- **Backlog note**: Offer detail view (unmatched) is 🟡 mostly done. Remaining: full offer card (amount · premium · methods · currencies · rep), offer status/expiry, counterparty profile link.

### 3.3 Offer Republish
- **File**: `src/screens/peach-trades-dashboard.jsx`
- **Endpoint**: `POST /v1/offer/:id/republish`
- **UI**: Add "Republish" button on expired/cancelled offers in trade history

### 3.4 Instant Trade Check + Execute
- **File**: `src/screens/peach-trades-dashboard.jsx` or `peach-market-view.jsx`
- **Endpoints**:
  - `GET /v069/{buyOffer|sellOffer}/:id/canInstantTrade`
  - `POST /v069/{buyOffer|sellOffer}/:id/instantTrade`
- **UI**: Show "Instant Trade" badge/button when available

### 3.5 Pre-Contract Chat (v069)
- **Endpoints**:
  - `GET /v069/buyOffer/:id/tradeRequestPerformed/chat`
  - `POST /v069/buyOffer/:id/tradeRequestPerformed/chat`
- **UI**: Chat panel in trade request view (before contract is created)

### 3.6 Sell Offer Submission
- **File**: `src/screens/peach-offer-creation.jsx`
- **Endpoint**: `POST /v069/sellOffer`
- **Requires**: `escrowPublicKey` and `releaseAddress` (Bitcoin key management dependency → Phase 5)

### 3.7 Escrow Funding (sell offers)
- **File**: `src/screens/peach-offer-creation.jsx`
- Currently has a "Simulate funding (demo)" button. Needs real escrow address display + funding status polling.

### 3.8 Create Multiple Offers
- **File**: `src/screens/offer-creation/index.jsx`
- **Scope**: Add a "create multiple offers" option at the offer creation stage for both buy and sell flows.
- **UI**: Allow the user to batch-create several offers at once (e.g. different amounts, currencies, or PM combinations) rather than submitting one at a time.
- **Endpoints**: Same as single offer — `POST /v069/buyOffer` / `POST /v069/sellOffer` — called once per offer in the batch.

---

## Phase 4: Settings & Secondary Features

### 4.1 Contact Peach
- **File**: `src/screens/peach-settings.jsx` → `ContactSubScreen`
- **Endpoint**: `POST /v1/contact/report` (body: `{ message, email? }`)
- **UI**: Text area + optional email + submit button

### 4.2 About Peach
- **File**: `src/screens/peach-settings.jsx` → `AboutSubScreen`
- **Endpoint**: `GET /v1/system/version`
- **UI**: Version, links to website/social, licenses, legal

### 4.3 Block/Unblock Users
- **File**: `src/screens/peach-settings.jsx` → `BlockUsersSubScreen`
- **Endpoints**: `POST /v1/user/:userId/block`, `POST /v1/user/:userId/unblock`
- **UI**: Already has mock list — wire to real API

### 4.4 Network Fees Preference Save
- **File**: `src/screens/peach-settings.jsx` → `NetworkFeesSubScreen`
- **Endpoint**: `PATCH /v1/user` (body: `{ feeRate }`)
- **UI**: Dropdown already exists, just wire the save

### 4.5 Language Sub-screen
- **File**: `src/screens/peach-settings.jsx` → `LanguageSubScreen`
- **Scope**: UI-only for now (language selector). Full i18n framework is a larger effort — defer string extraction, just build the selector UI and store preference in localStorage.

### 4.6 Notifications Sub-screen
- **File**: `src/screens/peach-settings.jsx` → `NotificationsSubScreen`
- **UI**: Toggle switches per notification type (trade updates, chat messages, offers matched, etc.)
- **Storage**: localStorage (no push notifications on web — in-app only)

### 4.7 Account & Sessions
- **File**: `src/screens/peach-settings.jsx` → `AccountSubScreen`
- **UI**: Show current session info (PeachID, connected since, session expiry). Logout button (already exists in nav). Desktop session list if API supports it.

### 4.8 PIN Code
- **File**: `src/screens/peach-settings.jsx` → `PinCodeSubScreen`
- **UI**: Client-side PIN for sensitive actions (stored hashed in localStorage). Set/change/remove flow.
- **Note**: This is a UX convenience, not real security — browser storage is not secure.

### 4.9 Custom Node
- **File**: `src/screens/peach-settings.jsx` → `NodeSubScreen`
- **UI**: Electrum/Bitcoin Core endpoint input. Store in localStorage. Used for fee estimates and tx broadcasting if wired.

### 4.10 Dark Mode
- **File**: `src/styles/global.css`
- **Implementation**: Add `[data-theme="dark"]` CSS custom property overrides. Toggle button already exists in topbar — wire it to flip `document.documentElement.dataset.theme` and persist to localStorage.
- **Also**: Add a dark mode toggle icon on the left side of the PeachID and avatar in the top bar.

### 4.11 Referral System
- **File**: `src/screens/peach-settings.jsx` → `ReferralsSubScreen`
- **Endpoints**: `POST /v1/user/redeem/referralCode`, `GET /v1/user/checkReferralCode`
- **UI**: Already has mock layout — wire to real data from `auth.profile`

### 4.12 My Profile (settings)
- Reads from `window.__PEACH_AUTH__.profile`. Remaining: referral, daily limits, memberSince.

### 4.13 Backups (settings)
- Static info screen (mobile-only, no API needed). Already built.

---

## Phase 5: Mobile-Assist Signing Relay (Architectural)

This unlocks features that need a Bitcoin signature from the mobile app.

### 5.1 Design the Signing Relay Protocol
- Desktop shows a QR code containing: `{ action, data_to_sign, contract_id }`
- Mobile scans, signs with Bitcoin key, returns signature via server relay (same Desktop Connection pattern from auth)
- Desktop receives signature, completes the API call

### 5.2 Features Unlocked by Signing Relay
| Feature | What Mobile Signs |
|---------|------------------|
| Sell offer creation | `escrowPublicKey` derivation + `returnAddress` |
| Seller payment confirm | `releaseTransaction` (signed PSBT) |
| Buyer payment confirm (if needed) | `releaseAddressMessageSignature` |
| Rating | Bitcoin message signature over rating |

### 5.3 Implementation
- **New component**: `SigningRelay.jsx` — generic QR display + polling component
- **Server endpoint**: Reuse Desktop Connection or create `/v1/signing-request`
- **Mobile app change needed**: Add "scan to sign" feature

---

## Phase 6: Remaining Features

### 6.1 Notifications / Activity Feed
- **New screen**: `src/screens/peach-notifications.jsx`
- **Route**: `/notifications`
- **Data source**: Poll contract summaries + offer summaries for status changes
- **UI**: Chronological list of events (offer matched, payment received, chat message, etc.)
- **No push notifications** — web-only in-app feed
- Browser tab title changes to `(●) Peach` when there's a new event

### 6.2 Auth Handshake Implementation
- **File**: `src/screens/peach-auth.jsx`
- **Implement the 6-step protocol** from `PEACH DESKTOP AUTH.pdf`:
  1. Generate PGP keypair (D1, D2) — `pgp.js` can do this
  2. Request Desktop Connection from server
  3. Display QR with connection ID + D2
  4. Poll server for PACKAGE_1
  5. Decrypt, show user confirmation (xpub address + PM data)
  6. Send ValidationPassword, receive auth token
- **Dependencies**: Server must implement the Desktop Connection endpoints

---

## Phase 7: Blocked / Deferred

| Feature | Blocker | Decision Needed |
|---------|---------|-----------------|
| Refund flow | PSBT signing in mobile app |relay to mobile |
| Wallet visualization | xpub not in auth object yet | Wait for auth protocol to include xpub (it's in the PDF spec) |
| Sell offer submission | Needs escrowPublicKey from mobile | Requires signing relay (Phase 5) |
| Seller release TX | Needs PSBT signing | Requires signing relay (Phase 5) |

---

## UI Fixes & Polish

Items that don't add new API wiring but improve existing screens.

### Global (all screens)
- **Peach Web logo file** — replace inline SVG with a proper logo asset used consistently
- **Colour uniformisation** — reduce gradient usage on orange bars, make them flatter/more subdued. ⚠️ Needs confirmation before any changes.
- **Lingo consistency with mobile app** — audit all labels and copy to match mobile terminology
- **Mobile responsive review** — all page layouts, especially topbar and home news card on small viewports
- **Payment method user labels** — custom labels (e.g. "SEPA - main", "SEPA - 2") to distinguish multiple PMs of same type. Applies to: Offer Creation PM selector, Payment Methods add/edit, anywhere saved PMs are shown.

### Home (`peach-home.jsx`)
- **My Profile card improvements** — distinguish public info (trade count, rating, badges) from private info (referral, daily limits). Use Peach standard Bitcoin format for all amounts. Details TBD.
- **Peach Bitcoin price card** — average and highest Bitcoin price on Peach over 24h, 7d, 30d, and all time.

### Trades Dashboard (`trades-dashboard/MatchesPopup.jsx`)
- **MatchesPopup — avatars, reputation & trades not wired** — match cards currently show placeholder/missing data for counterparty avatars, reputation scores, and trade counts. Wire these from the match/user data returned by the API.

### Market View (`peach-market-view.jsx`)
- **Filter parity with mobile app** — implement same filter set as mobile. Exact filter list TBD.

### Offer Creation (`offer-creation/index.jsx`)
- **"No new users" filter** — wire the checkbox end-to-end: include flag in offer payload, reflect that traders with <3 completed trades are excluded.
- **Wire validators into PM add flow** — mini PM-add modal accepts IBAN/phone/holder with zero validation. Inline validators from `peach-validators.js` + add `onBlur` validation.

### Trade Execution (`trade-execution/index.jsx`)
- **Wrong amount escrow modal** — modal when seller funds with wrong amount. Options: continue (if close enough) or request refund.
- **Copy buttons mobile layout** — "Copy Address" and "Copy BTC" buttons don't render well on mobile.
- **Escrow funding timer (buyer POV)** — countdown at "Waiting for escrow" stage. `instantTrade` determines duration (1H instant, 12H normal). Source: `SellOffer.funding.expiry`.
- **Escrow funding timer (seller POV)** — big, prominent countdown for how long seller has left to fund. Same data source.

---

## Execution Order (Suggested)

| Order | Item | Effort | Impact |
|-------|------|--------|--------|
| ~~1~~ | ~~1.1 Extend deadline~~ | ✅ Done | |
| ~~2~~ | ~~1.3 Chat send + decrypt~~ | ✅ Done | |
| ~~3~~ | ~~1.4 Chat pagination + mark read + polling~~ | ✅ Done | |
| ~~4~~ | ~~1.2 Buyer payment confirm~~ | ✅ Done | |
| ~~5~~ | ~~1.5 Dispute submission~~ | ✅ Done | |
| ~~5b~~ | ~~1.6 Dispute ack + outcome~~ | ✅ Done | |
| 6 | 2.1 Contract cancellation | ~1 session | Safety feature |
| 7 | 2.2 Unread counts | ~30 min | Polish |
| 8 | 3.1–3.2 Reject + edit/withdraw | ~1 session | Offer management |
| 9 | 4.1–4.2 Contact + About | ~1 session | Easy settings wins |
| 10 | 4.3–4.4 Block users + fee save | ~1 session | Settings completion |
| 11 | 4.10 Dark mode | ~1-2 sessions | User experience |
| 12 | 4.5–4.9 Remaining settings | ~2-3 sessions | Settings completion |
| 13 | 3.3–3.5 Republish, instant trade, pre-chat | ~2 sessions | Advanced offer features |
| 14 | 6.1 Notifications feed | ~2-3 sessions | New screen |
| 15 | 2.3 Rating | ~1 session | If PGP sig works; else Phase 5 |
| 16 | 6.2 Auth handshake | ~3-4 sessions | Requires server endpoints |
| 17 | 5.x Signing relay | ~3-4 sessions | Unlocks sell-side |
| 18 | 4.11 Referrals | ~1 session | Nice-to-have |
| — | UI fixes & polish | Ongoing | Sprinkle between phases |

---

## Engineering Dependencies (flag before building)

- ~~**Chat encryption key compatibility** — mobile app keypair must be importable/derivable in the browser.~~ ✅ Resolved — works with openpgp.js v6.
- ~~**Dispute symmetric key encryption** — encrypt chat symmetric key with platform PGP public key (from `GET /info`).~~ ✅ Resolved — `encryptForPublicKey()` in pgp.js. PM fields use symmetric-then-asymmetric decryption fallback.
- **`useApi()` v069 support** — consider adding a version parameter to avoid manual URL string manipulation in every screen.

---

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/screens/trade-execution/index.jsx` | Wire remaining trade actions, cancellation, rating |
| `src/screens/trades-dashboard/index.jsx` | Reject, republish, unread counts, instant trade |
| `src/screens/peach-market-view.jsx` | Edit/withdraw own offers, filter parity |
| `src/screens/offer-creation/index.jsx` | Sell offer, "no new users" flag, PM validators |
| `src/screens/peach-settings.jsx` | 7 empty sub-screens + fee save + block users + referrals |
| `src/screens/peach-home.jsx` | Profile card, price card |
| `src/screens/peach-auth.jsx` | Full auth handshake (when server ready) |
| `src/styles/global.css` | Dark mode theme variables |
| `src/utils/pgp.js` | Already complete — reuse existing functions |
| `src/hooks/useApi.js` | Already complete — consider v069 param addition |
