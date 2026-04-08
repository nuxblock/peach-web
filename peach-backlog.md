# Peach Web — Backlog

Everything that needs to be built, wired, or fixed. Organized by priority phase.

Completed items archived in `peach-completed.md`.

**Constraint:** No Bitcoin private key operations in the browser (those stay on mobile). The browser has the user's PGP private key, so all PGP encryption/decryption/signing works.

---

---

## Phase 4: Settings & Secondary Features

### 4.5 Language Sub-screen
- **File**: `src/screens/settings/index.jsx` → `LanguageSubScreen`
- **Scope**: UI-only for now (language selector). Full i18n framework is a larger effort — defer string extraction, just build the selector UI and store preference in localStorage.

### 4.6 Notifications Sub-screen
- **File**: `src/screens/settings/index.jsx` → `NotificationsSubScreen`
- **UI**: Toggle switches per notification type (trade updates, chat messages, offers matched, etc.)
- **Storage**: localStorage (no push notifications on web — in-app only)

### 4.7 Account & Sessions
- **File**: `src/screens/settings/index.jsx` → `AccountSubScreen`
- **UI**: Show current session info (PeachID, connected since, session expiry). Logout button (already exists in nav). Desktop session list if API supports it.

### 4.8 PIN Code
- **File**: `src/screens/settings/index.jsx` → `PinCodeSubScreen`
- **UI**: Client-side PIN for sensitive actions (stored hashed in localStorage). Set/change/remove flow.
- **Note**: This is a UX convenience, not real security — browser storage is not secure.

### 4.9 Custom Node
- **File**: `src/screens/settings/index.jsx` → `NodeSubScreen`
- **UI**: Electrum/Bitcoin Core endpoint input. Store in localStorage. Used for fee estimates and tx broadcasting if wired.

### 4.10 Dark Mode
- **File**: `src/styles/global.css`
- **Implementation**: Add `[data-theme="dark"]` CSS custom property overrides. Toggle button already exists in topbar — wire it to flip `document.documentElement.dataset.theme` and persist to localStorage.
- **Also**: Add a dark mode toggle icon on the left side of the PeachID and avatar in the top bar.

### 4.11 Referral System
- **File**: `src/screens/settings/index.jsx` → `ReferralsSubScreen`
- **Endpoints**: `POST /v1/user/redeem/referralCode`, `GET /v1/user/checkReferralCode`
- **UI**: Wire to real data from `auth.profile`

### 4.12 My Profile (settings)
- Reads from `window.__PEACH_AUTH__.profile`. Remaining: referral, daily limits, memberSince.

---

## Phase 5: Mobile-Assist Signing — Remaining Items

Browser side complete. Remaining items blocked on backend/mobile teams.

### 5.3 Backend endpoints — still waiting
- `GET /v1/user/returnAddressIndex` — returns next unused index for return address derivation (needed for sell offers)
- Standalone rating endpoint (without release) — needed to replace last mock `createTask("rate", ...)`

### 5.4 Mobile pending tasks UI (mobile team)
- Poll or receive push for `/pendingTasks`
- Confirmation UI per task type
- Sign + submit using existing mobile signing code

### 5.5 Last mock endpoint
- `"rate"` — still uses mock `createTask("rate", ...)` in `trade-execution/index.jsx:1047`. Mock `createTask()` in `useApi.js` can be deleted once the real rating endpoint is wired.
- End-to-end testing on regtest

---

## Phase 7: Blocked / Deferred

| Feature | Blocker | Status |
|---------|---------|--------|
| Wallet visualization | Needs UI design | xpub available in `window.__PEACH_AUTH__.xpub` via QR auth. Uses `@scure/bip32` (already in deps). |
| Blocked users list sync | ✅ Done | Wired `GET /v069/selfUser/blockedUsers` into Settings > Blocked Users screen. Block/unblock also works (`PUT /user/:id/block`, `DELETE /user/:id/block`). |
| Network Fees preference sync | Backend team (nice-to-have) | Would benefit from loading saved preference on mount via `GET /user/me`. |
| `sellOffer?ownOffers=true` fix | Backend team — endpoint ignores `ownOffers` param for sell offers | Simplifies fetch in 4 screens. See `trades-dashboard-dual-fetch-report.md`. |
| `contracts/summary` status fix | Backend team | Summary always returns `tradeCanceled` for cancelled contracts, even when seller still has escrow. Web derives status client-side as workaround. |
| `GET /v1/user/returnAddressIndex` | Backend team | Sell offer return address derivation. Current workaround counts total sell offers. |
| 5.4 Mobile pending tasks UI | Mobile team | End-to-end signing flow. |
| 5.5 Rating endpoint | Backend team — standalone rating (without release) | Last mock `createTask` — 3/4 actions already wired to real endpoints. |

---

## UI Fixes & Polish

Items that don't add new API wiring but improve existing screens. Organized by priority tier.

### Functional gaps (wire missing data or add missing UI)
- ~~**Trade Execution: wrong amount escrow modal**~~ — ✅ Done. `WrongAmountFundedCard` handles `fundingAmountDifferent`, `wrongAmountFundedOnContract`, `wrongAmountFundedOnContractRefundWaiting`. Seller gets continue/refund options. Buyer sees waiting message.
- **Trade Execution: escrow funding timer (buyer POV)** — countdown at "Waiting for escrow" stage. `instantTrade` determines duration (1H instant, 12H normal). Source: `SellOffer.funding.expiry`. (`trade-execution/index.jsx`)
- **Trade Execution: escrow funding timer (seller POV)** — big, prominent countdown for how long seller has left to fund. Same data source. (`trade-execution/index.jsx`)
- **Trades Dashboard: MatchesPopup avatars/reputation wiring** — match cards currently show placeholder/missing data for counterparty avatars, reputation scores, and trade counts. Wire from match/user API data. (`trades-dashboard/MatchesPopup.jsx`)
- **Offer Creation: full add-PM flow + validators** — Allow user to add a brand new payment method directly from the offer creation screen without leaving the flow (currently can only select from existing PMs). Also wire inline validators from `peach-validators.js` + `onBlur` validation for IBAN/phone/holder fields. (`offer-creation/index.jsx`)
- **Home: wire remaining stats cards** — Active Offers now wired from `GET /market/offers/stats`. Still placeholder: 24h Volume, Trades Today, Top PMs, Top Currencies — all waiting for new backend endpoints (coordinating with backend dev week of 2026-04-07). Profile card rating, badges, volume, and last trade are now wired from real data. (`peach-home.jsx`)
- **Trade Execution: copy buttons mobile layout** — "Copy Address" and "Copy BTC" buttons don't render well on mobile. (`trade-execution/index.jsx`)
- **Market View: filter parity with mobile app** — implement same filter set as mobile. Exact filter list TBD. (`market-view/index.jsx`)
- ~~**Offer Creation: experience level filter improvements**~~ — ✅ Done. Experience level filter now available on both buy and sell. Instant Match section enhanced with "No new users", "Minimum reputation: 4.5", and badge filter chips (Fast trader / super trader). `experienceLevelCriteria` sent in both buy and sell payloads. Experience level badges shown in Market View and Trades Dashboard.
- **Trade Execution: escrow funding link (not QR)** — the funded escrow "QR code" is not actually useful as a QR. Replace with a clickable link to mempool.space (or other block explorer) for the escrow address. (`trade-execution/index.jsx`)
- **Trade Execution: remove QR/address on tx detection** — when a transaction is detected during escrow funding, remove or hide the QR code and funding address display since it's no longer needed. (`trade-execution/index.jsx`)
- **Trade Execution: grouphug toggle (buyer POV)** — add a toggle in the trade execution screen from the buyer's perspective to enable/disable transaction batching (grouphug). (`trade-execution/index.jsx`)
- ~~**Notifications: major upgrade**~~ — ✅ Mostly done. 7 new status mappings added, `warning` type with icon, ID-based read tracking, `markRead()` for individual notifications, faster polling (8s). Remaining: final audit pass to verify all 31 trade statuses have correct notifications.
- **Market View / Trades Dashboard: visual cue for limit-paused offers** — own offers that are off the market because of trading limits should have a clear visual indicator (badge, dimmed state, or label) so the user knows why they're inactive. (`market-view/index.jsx`, `trades-dashboard/index.jsx`)
- ~~**Global: session timeout handling**~~ — ✅ Done. `sessionGuard.js` detects 401 responses with two-step verification (JWT exp check + server probe). Dispatches `peach:session-expired` event. Short-circuits after first expiry.

### Polish (visual/consistency)
- **Global: Peach Web logo file** — replace inline SVG with a proper logo asset used consistently
- **Global: colour uniformisation** — reduce gradient usage on orange bars, make them flatter/more subdued. ⚠️ Needs confirmation before any changes.
- **Global: lingo consistency with mobile app** — audit all labels and copy to match mobile terminology
- **Global: mobile responsive review** — all page layouts, especially topbar and home news card on small viewports
- **Global: PM user labels** — custom labels (e.g. "SEPA - main", "SEPA - 2") to distinguish multiple PMs of same type. Applies to: Offer Creation PM selector, Payment Methods add/edit, anywhere saved PMs are shown.
- **Home: rethink page design and structure** — broader redesign of the home page layout: rearrange card positions, rethink what's shown and how. Includes existing sub-items: (1) profile card improvements — distinguish public info (trade count, rating, badges) from private info (referral, daily limits), use Peach standard Bitcoin format; (2) Peach Bitcoin price card — average and highest Bitcoin price on Peach over 24h, 7d, 30d, and all time. (`peach-home.jsx`)

### To verify (needs regtest)
- **Trade Execution: rating modal** — `MobileSigningModal` wired to `RatingPanel.onRate`. Mock `createTask("rate", ...)` fires, modal appears. Needs real regtest trade in `rateUser` status to test. Verify: select rating → submit → modal shows → cancel closes it.
- **Trade Execution: refundOrReviveRequired status** — 3.3 Republish/Refund UI is implemented but untested. Yellow banner + two sliders (Re-publish Offer / Refund Escrow) should appear when a contract reaches `refundOrReviveRequired` status. Republish calls `POST /v1/offer/:offerId/revive`. Refund goes through MobileSigningModal. Needs a regtest trade that gets cancelled to reach this status.

---

## Engineering Dependencies (flag before building)

- **`useApi()` v069 support** — consider adding a version parameter to avoid manual URL string manipulation in every screen. → Tracked as execution order #24.

---

## Key Files to Modify

| File | Remaining changes |
|------|-------------------|
| `src/screens/trade-execution/index.jsx` | Escrow timers, escrow link, remove QR on tx detection, grouphug toggle, copy buttons mobile |
| `src/screens/trades-dashboard/index.jsx` | Republish, instant trade |
| `src/screens/market-view/index.jsx` | Filter parity |
| `src/screens/offer-creation/index.jsx` | PM validators |
| `src/screens/settings/index.jsx` + `screens.jsx` | 5 remaining sub-screens (4.5–4.9) + referrals (4.11) + profile (4.12) |
| `src/screens/peach-home.jsx` | Wire remaining stats (24h volume, trades today, top PMs, top currencies — needs backend endpoints) |
| `src/styles/global.css` | Dark mode theme variables |
| `src/hooks/useApi.js` | Delete mock `createTask()` once rating endpoint lands, v069 param support (#24) |
| `src/utils/sessionGuard.js` | ✅ Session timeout detection done |
| `src/components/MobileSigningModal.jsx` | Only used for rating now (3/4 actions wired directly) |
