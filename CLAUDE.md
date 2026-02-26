# Peach Bitcoin Web App — Project Context

## What this is
A web companion app for Peach Bitcoin (peachbitcoin.com), a peer-to-peer Bitcoin exchange.
The web app is **frontend only** — zero new API endpoints. Every feature maps to the existing REST API at `https://api.peachbitcoin.com/v1`.

Full product spec: `peach-web-specifications.html`
Full API reference: `peach-api-reference.html`

---

## Tech stack
- **React** (JSX, hooks only — no class components)
- **Styling:** Inline styles + a single CSS string injected via `<style>` tag. No Tailwind, no CSS modules, no external styling framework.
- **Font:** Baloo 2 via Google Fonts (`@import` in the CSS string), weights 400/500/600/700/800
- **No component library** — all components are bespoke, styled to Peach design tokens

---

## Design tokens
Use these variables consistently. Do not invent new colours.

```
Backgrounds:  #FFF9F6 (main), #FFFFFF (surface), #FEEDE5 (mild), #F4EEEB (5%)
Primary:      #F56522 (main), #C45104 (dark), #FEEDE5 (bg)
Gradient:     linear-gradient(90deg, #FF4D42, #FF7A50, #FFA24C)
Success:      #65A519 (main), #F2F9E7 (bg)
Error:        #DF321F (main), #FFF0EE (bg)
Warning:      #F5CE22
Info:         #037DB5
Black scale:  #2B1911 (100%), #624D44 (75%), #7D675E 65%), #C4B5AE (25%), #EAE3DF (10%), #F4EEEB (5%)
Bitcoin:      #F7931A
Leaf green:   #05A85A (logo only)
```

---

## Topbar — strict consistency rule
**Every screen uses the same topbar.** Do not deviate.

```
height: 56px | background: #FFFFFF | border-bottom: 1px solid #EAE3DF
position: fixed, top: 0, left: 0, right: 0, z-index: 200
padding: 0 20px | gap: 12px | display: flex, align-items: center
```

Contents (authenticated): `<PeachIcon size={28}/>` · gradient wordmark "Peach" · BTC/EUR price pill · right side: "Updated Xs ago" indicator + user avatar with notification badge

Contents (unauthenticated / auth screen): same logo + price pill · right side: "Sign in to trade" label (no avatar)

The `PeachIcon` component is defined in every file as an inline SVG (viewBox `0 0 352 353`). Copy it from an existing file rather than re-writing it.

---

## Screens — build status

| Screen | Status | File |
|--------|--------|------|
| Landing / Auth | ✅ Built | `peach-auth.jsx` |
| Home Dashboard | ✅ Built | `peach-home.jsx` |
| Market View | ✅ Built | `peach-market-view.jsx` |
| Offer Creation | ✅ Built | `peach-offer-creation.jsx` |
| Trades Dashboard | ✅ Built | `peach-trades-dashboard.jsx` |
| Trade Execution (split panel + chat) | ✅ Built | `peach-trade-execution.jsx` |
| Dispute flow | ✅ Built (inline in trade execution) | `peach-trade-execution.jsx` |
| Settings | ✅ Built | `peach-settings.jsx` |
| Status cards (component library) | ✅ Built | `peach-status-cards.jsx` |
| Profile & Reputation | ⬜ Not started | — |
| Notifications / Activity feed | ⬜ Not started | — |
| Payment Methods management | ⬜ Not started | — |
| Offer detail view (unmatched) | ⬜ Not started | — |
| Trade request acceptance flow | ⬜ Not started | — |
| Refund flow (PSBT signing) | ⬜ Not started | — |

---

## Hard rules — things that were corrected during design

### Amounts
- **Sell offers (ask):** single fixed number of sats. The escrow is pre-funded; the output is predetermined. Never show a range.
- **Buy offers (bid):** a range `[min, max]` sats. The buyer specifies acceptable bounds.
- `AmountCell` must branch on `offer.type === "ask"`.

### Premium colours are perspective-aware
- **Buy tab** (viewing sell offers): negative premium = green (good for buyer), positive = red (bad for buyer)
- **Sell tab** (viewing buy offers): **inverted** — positive = green (good for seller), negative = red
- This applies to every premium value in the table AND to the stats pill. There is no "neutral" framing.

### "Instant Match" badge
- User-facing label is **"⚡ Instant Match"** — never "Auto" or "auto-trade"
- It belongs in the **action cell** (next to the Buy/Sell/Edit button), not in the reputation column
- It is an **offer attribute**, not a seller attribute
- No gradient row highlight for Instant Match offers — all rows are visually uniform

### Online/offline indicator
- Online users: small green dot (9px, `background: #65A519`) positioned bottom-right of the avatar, with a white 2px border
- Offline users: **no dot** — avatar keeps the orange gradient
- **Never grey out the avatar** for offline users

### Own offers (current user's offers)
- Orange left border (`3px solid #F56522`) + subtle warm gradient row background
- "Your offer" pill in the action cell (`background: #FEEDE5`, `color: #C45104`)
- **"✏ Edit" button** replaces the Buy/Sell action — never show a greyed-out/disabled Buy button
- Edit button: `background: #FEEDE5; color: #C45104` → hover: solid orange
- "My Offers" button in subheader toggles a filter showing only own offers; button turns orange-tinted with "My Offers ✕" when active

### Filters
- **Currency and payment method:** custom multi-select dropdown components with checkboxes, OR logic (offer shown if it accepts *any* selected option)
- **Reputation:** plain native `<select>` — single-select only
- Multi-select trigger shows a count badge when items are selected; "Clear selection" at the bottom of the panel; closes on outside click

### Stats pill
- Shows: `{n} offers · Avg {X}% · Best {Y}%`
- "Best" is context-aware: lowest premium on Buy tab, highest premium on Sell tab
- Stat colours follow the same perspective-aware inversion as table premium colours

---

## Home Dashboard (`peach-home.jsx`)

### Layout
- **Dashboard grid:** CSS `display: grid; grid-template-columns: auto auto; justify-content: start` — columns hug their content; cards do not stretch to fill screen width.
- **Profile card** spans 2 rows (`grid-row: span 2`), top-left.
- **Top Payment Methods card** sits top-right, next to profile.
- **Peach Stats card** sits bottom-right, below Top Payment Methods.
- **Offer Book Snapshot** is outside the dashboard grid in a plain `<div>`, so it fills the full content width.
- On mobile (≤700px): grid switches to single column, all cards go full width.

### Profile card fields
- Avatar · PeachID · Member since
- Stats row: Trades · Rating · Disputes
- Badges row
- Second stats row: Total Volume (BTC) · Last Trade (Xd ago) · Blocked by (X)
- **No payment methods or currencies** in the profile card.

### Peach Stats card
- Three columns: 24h Volume · Trades Today · Active Offers
- Top Payment Methods is a **separate card**, not inside Peach Stats.

### Card sizing rules
- Cards use `width: fit-content; max-width: 100%` — they hug their content.
- Cards do **not** stretch to fill available space unless explicitly set (e.g. Offer Book uses `width: 100%`).

### Responsive — mobile (≤700px)
- Sidebar slides off-screen; `navWidth` is set to `0` via an `isMobile` state (resize listener on 700px breakpoint).
- Dashboard grid becomes single-column; all cards stretch to full width.

### Mock data shape (`MOCK_USER`)
```js
{
  peachId, memberSince, trades, disputesTotal, rating,
  badges,                  // ["supertrader", "fast"]
  preferredMethods,        // kept in mock but not displayed in profile card
  preferredCurrencies,     // kept in mock but not displayed in profile card
  totalVolumeBtc,          // number
  lastTradeDaysAgo,        // number
  blockedByCount,          // number
}
```

---

## Settings screen specifics (`peach-settings.jsx`)

### Layout
- Single-column scrollable list, max-width 640px, left-aligned under the sidenav.
- Page title: "Settings" (H1, 800 weight) — no subheader bar.
- Content padding: `32px 24px 80px` desktop, `24px 16px 80px` mobile.

### Sections & grouping (strict order)
1. **Account** — My Profile · Referrals · Backups (⚠️ warning if no backup)
2. **Trading & Bitcoin** — Payment Methods · Network Fees · Transaction Batching · Refund Address · Custom Payout Wallet
3. **App & Notifications** — Notifications · Pin Code · Currency · Language · Dark Mode (toggle) · Diagnostics (toggle)
4. **Advanced & Support** — Use Your Own Node · Contact Peach · About Peach

### SettingsRow component rules
- Section group header: `font-size .72rem`, `font-weight 700`, `text-transform uppercase`, `color #F56522`, `margin-bottom 8px`
- Each group is a white card (`background #FFFFFF`, `border 1px solid #EAE3DF`, `border-radius 12px`)
- Row: `padding 14px 20px`, `border-bottom 1px solid #F4EEEB` (last row in group has no border)
- Row hover background: `#FFF9F6` — only when the row is tappable (has `onClick`)
- Icon column: 36×36px, `border-radius 10px`, `background #F4EEEB`
- Label: `.9rem / 600`, description subtitle: `.75rem / 400 / #7D675E`
- Tappable rows show `<IconChevronRight/>` in `#C4B5AE` on the right
- Toggle rows (Dark Mode, Diagnostics): no chevron — toggle replaces it
- Backups warning: label color `#DF321F` + ⚠️ emoji on right (no chevron)
- Currency and Language rows show current value as the description text (e.g. "EUR", "English")

### Version footer
- Below all sections: centered, `.72rem`, `#C4B5AE`, text: `Peach Bitcoin Web · v{version} · Made with 🍑`

---

## Auth screen specifics (`peach-auth.jsx`)

### Responsive breakpoint: 768px
**Desktop (≥768px) — QR flow:**
- Ghost market (non-interactive skeleton of market view) behind the auth card, fading bottom
- White card centred: copy + 3-step instructions left | QR + countdown ring right
- QR states: waiting → scanning → success → expired (click QR to cycle in demo)
- Countdown ring depletes over 3 min, turns red at 30s remaining

**Mobile (<768px) — Paste-code flow:**
- No QR code — user cannot scan their own screen
- Paste-code instructions: Open Peach app → **Settings → Connect web browser** → copy the one-time code → paste into the web field
- `<textarea>` input, "Sign In" button, inline validation
- States: idle → validating (spinner) → success (green checkmark pop) → error (shake animation + inline message)
- Codes are single-use, expire after 3 minutes

### Auth technical spec
- Challenge nonce TTL: **3 minutes**
- Session token TTL: **60 minutes** — silent refresh at 50 min
- Endpoint: `POST /user/auth` with `{ publicKey, message, signature }`
- Token storage: memory first, httpOnly cookie fallback — never URL params, never plain localStorage
- Deep link: `peach://web-auth?challenge=<nonce>&callback=<origin/auth/callback>`
- Keypair **never** leaves the mobile device

---

## Polling architecture (no WebSockets)

| Context | Interval |
|---------|----------|
| BTC price (topbar) | 15s |
| Offer list (market view) | 15s |
| Active trade chat (tab visible) | 5s |
| Active trade chat (tab backgrounded) | 30s |
| Dashboard (no trade open) | 30s |

---

## Mock data conventions (for prototype screens)

```js
// Offer shape
{
  id: string,
  type: "ask" | "bid",
  amount: number,          // ask: fixed sats
          [number, number],// bid: [min, max] sats
  premium: number,         // % relative to market price (can be negative)
  methods: string[],       // ["SEPA", "Revolut", "PayPal", "Wise", …]
  currencies: string[],    // ["EUR", "CHF", "GBP"]
  rep: number,             // 0.0–5.0
  trades: number,          // lifetime trade count
  badges: string[],        // ["supertrader", "fast"] — seller attributes
  auto: boolean,           // true = Instant Match offer
  online: boolean,
  isOwn?: boolean          // current user's offer
}
```

Own offer examples already in mock data:
- `a_me`: ask, 73k sats, +0.8%, SEPA+Wise, EUR+CHF, 4.7★, 23 trades
- `b_me`: bid, [40k–120k] sats, −0.5%, SEPA, EUR, 4.7★, 23 trades

BTC mock price: `87432` EUR (ticks ±~70 every 8s in demo)

---

## Button / component patterns

### Gradient CTA (primary action)
```css
background: linear-gradient(90deg, #FF4D42, #FF7A50, #FFA24C);
color: white; border: none; border-radius: 999px;
font-family: Baloo 2; font-weight: 800; font-size: .85rem;
box-shadow: 0 2px 12px rgba(245,101,34,.3);
:hover → translateY(-1px), stronger shadow
```

### Secondary button ("My Offers", "Cancel", etc.)
```css
background: #FFFFFF; color: #2B1911;
border: 1.5px solid #EAE3DF; border-radius: 999px;
font-weight: 700;
:hover → border-color: #F56522; color: #C45104
Active → background: #FEEDE5; border-color: #F56522
```

### Reputation badges
| Badge | Style |
|-------|-------|
| 🏆 Supertrader | `background: linear-gradient(90deg,#FF4D42,#FFA24C); color: white` |
| ⚡ Fast | `background: #FEEDE5; color: #C45104` |
| ⚡ Instant Match | Gradient bg, white text — action cell only |
| Your offer | `background: #FEEDE5; border: 1px solid rgba(245,101,34,.25); color: #C45104` |

### Table action buttons
- Buy: `background: #F2F9E7; color: #65A519` → hover: solid green + white text
- Sell: `background: #FFF0EE; color: #DF321F` → hover: solid red + white text  
- Edit: `background: #FEEDE5; color: #C45104` → hover: solid orange + white text

---

## Trade Execution screen (`peach-trade-execution.jsx`)

### Layout
- **Desktop (≥900px):** Split panel — left 42% (trade details), right 58% (chat). Both panels fill viewport height with independent scroll.
- **Mobile (<900px):** Tab switcher — "Trade Details" / "Chat" tabs, single panel visible at a time.
- **Fixed bottom bar:** Horizontal 4-step progress stepper pinned to the bottom of the viewport across all states. Steps: Matched → Escrow Funded → Payment Sent → Completed.
- **Trade sub-topbar** (below main topbar): Back button · Trade ID (monospace) · BUY/SELL badge · Counterparty name · Status chip · Elapsed time (right-aligned).
- Status chip sits **inline on the left** of the sub-topbar, next to counterparty name — not centred, not right-aligned.

### Trade lifecycle states (as implemented)
4-step lifecycle. "Payment Confirmed" is NOT a separate step — it is merged into "Payment Sent".

| Status | Stepper step | Seller action | Buyer action |
|--------|-------------|---------------|--------------|
| `matched` | 0 — Matched | Fund escrow (QR + address + amount) | Wait (no action) |
| `escrow_funded` / `awaiting_payment` | 1 — Escrow Funded | Wait for buyer | Send fiat payment |
| `payment_in_transit` / `payment_confirmed` | 2 — Payment Sent | Confirm receipt → releases BTC | Wait for seller |
| `completed` | 3 — Completed | Rate counterparty | Rate counterparty |
| `dispute` | shows at step 2 with red alert | — | — |

### Panel order in left panel (strict)
1. Counterparty card (avatar, name, rep, badges, role badge)
2. Trade amounts grid (sats, fiat, premium, method)
3. **Actions** (always first content section — includes deadline pill, escrow funding card, main CTAs)
4. Payment Details (buyer only, when escrow funded)
5. Escrow (seller only, compact address card, non-matched states only)
6. Rating panel (completed state only)

### Actions panel rules
- **Payment deadline** appears as an orange pill at the top of Actions when active — except for "seller awaiting payment" which has its own merged orange bar.
- **Seller — awaiting payment:** merged orange bar: `🕐 Waiting for the buyer to send payment. Xh remaining.` + greyed-out disabled "✓ I Received the Payment" button below (seller cannot act yet).
- **Seller — payment in transit / confirmed:** active gradient "✓ I Received the Payment" button. Clicking → red confirmation modal before releasing escrow.
- **No "Request Cancellation" button anywhere** — cancellation is not user-initiated in this flow.
- **"Cancellation Requested" screen does not exist** — remove if found.
- **Buyer — matched:** ⏳ waiting icon + "Waiting for escrow" heading + description + bold "No actions required for the moment."
- **Buyer — escrow funded:** hint text + gradient "✓ I've Sent the Payment" button.

### Escrow funding card (seller, matched state)
Lives inside the Actions panel. Contains:
- Amount to send (sats + BTC), copy BTC button
- QR code (address-only or BIP21 `bitcoin:<address>?amount=<btc>` format)
- Toggle: "Address only" / "Address + amount" — address+amount allows wallet to auto-fill both fields
- Hint text explaining each toggle mode
- Full monospace address + copy button

### Chat panel rules
- **Matched state:** Chat is always visible but overlaid with a frosted blur + lock icon + "Chat disabled while waiting for seller to fund escrow" message.
- **Trading Rules card:** Collapsible card at the top of the chat (yellow `#FEFCE5` background). Collapsed by default. Exact text from the app must be preserved.
- **Encryption notice bar:** monospace, `#F4EEEB` background, below Trading Rules.
- **"Open dispute" button:** Floats top-right of chat area, positioned absolutely below the encryption bar. White fill, red border, `#FFF0EE` background on hover.
  - In `dispute` state: changes to "dispute open", dashed border, dimmed, non-clickable.
  - In `matched` state: dimmed and non-clickable.
- Chat input: textarea + send button. Dispute button is NOT in the input row.

### Dispute flow (3-step modal)
Triggered by "open dispute" button in chat:
1. **Warning:** exact text — "This will request the intervention of a Peach employee to mediate between you and your counterpart. / Opening a dispute will reveal the chat and payment methods to Peach. / Please only use this as a last resort." Red bottom bar with "⊙ open dispute" + "close ✕".
2. **Reason:** "what's up?" heading + 4 pill options: BITCOIN NOT RECEIVED / SELLER UNRESPONSIVE / ABUSIVE BEHAVIOUR / SOMETHING ELSE. Selecting advances to step 3.
3. **Details:** Email input + reason (pre-filled, read-only) + free-text message. CONFIRM button disabled until email and message filled.

### Release Bitcoin confirmation modal
Red modal, triggered by "✓ I Received the Payment":
- Title: "Confirm payment received?"
- Body: warns this immediately releases BTC from escrow
- Confirm button: red, "Yes, release Bitcoin"

### Preview state switcher (demo only)
Dark brown collapsible bar just below the main topbar. Collapsed by default — shows only a small "Preview ▾" pill top-left. Expanding reveals all scenario buttons. Must be removed before production.

---

## API endpoints used so far

| Endpoint | Where | Purpose |
|----------|-------|---------|
| `POST /user/auth` | Auth screen | Get session token |
| `GET /market/price/BTCEUR` | Topbar | Live BTC price |
| `POST /offer/search` | Market View | Fetch offer list |

All 63 endpoints are in `peach-api-reference.html`. Reference it before adding new features.

---

## Pending fixes & additions

### Home (`peach-home.jsx`)
- Remove the Orderbook Preview section entirely
- Add a "Top Currencies" card next to the Top Payment Methods card
- Add sats unit label to the 24h Volume figure in the Peach Stats card
- Add a wide "News" card above the user profile card (full width, at the top)

### Side nav
- Remove the "News" button
- Add a "Payment Methods" button (links to new PM management screen)

### Offer Creation (`peach-offer-creation.jsx`)
- Add a "No new users" checkbox under the Instant Trade option — only enabled when Instant Trade is on
- At the Review stage: remove or grey-out the BUY BTC / SELL BTC toggle
- At the Review stage: center the summary card

### Trade Execution (`peach-trade-execution.jsx`)
- Add QR code to the escrow funding card with toggle (address only / address + amount) — verify against current implementation before building, as this is already specced above
- Add a modal for when the seller funds the escrow with the wrong amount — options to continue (if amount is close enough) or request a refund

---

## What to read at session start

1. This file (`CLAUDE.md`)
2. `peach-web-specifications.html` — full requirements and functional spec for all screens
3. `peach-api-reference.html` — before implementing any data fetching
4. The relevant `.jsx` file if continuing work on an existing screen
