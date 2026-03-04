# Peach Bitcoin Web App — Claude Instructions

## Behavioral rules

- **Be concise.** If you don't know something, say so — don't invent.
- **Never delete anything** without explicit permission.
- **When given specific text to implement**, implement only that. Write suggestions in chat — do not act on them.
- **Never modify exact strings** provided by the user (warning messages, labels, copy). Reproduce them verbatim.
- **Only make the requested changes.** Do not add unrequested improvements or refactor while fixing a bug.
- **Ask before proceeding** if something is ambiguous rather than guessing.

---

## What this is

Frontend-only web companion app for Peach Bitcoin (peachbitcoin.com), a peer-to-peer Bitcoin exchange.  
Zero new API endpoints — every feature maps to the existing REST API at `https://api.peachbitcoin.com/v1`.

Full design spec: `peach-web-mvp-spec.html`  
Full API reference: `peach-api-reference.md`

---

## Tech stack

- **React** (JSX, hooks only — no class components)
- **Styling:** Inline styles + a single CSS string injected via `<style>` tag. No Tailwind, no CSS modules, no external styling framework.
- **Font:** Baloo 2 via Google Fonts (`@import` in the CSS string), weights 400/500/600/700/800
- **No component library** — all components are bespoke, styled to Peach design tokens

---

## Peach standard Bitcoin format

All Bitcoin amounts use this format. No exceptions.

The amount is the full BTC decimal value, split visually into two parts:
- **Left (grey/subdued):** ₿ icon + leading non-significant zeros (e.g. `0,00` or `0,000` or `0,0000`)
- **Right (bold black):** significant digits in sats with space as thousands separator, followed by `Sats`

The split point depends on magnitude — the grey zeros show BTC-scale context:
- 250 000 sats → ₿ `0,00` **250 000 Sats**
- 85 000 sats → ₿ `0,000` **85 000 Sats**
- 9 000 sats → ₿ `0,0000` **9 000 Sats**

Rules:
- Comma as decimal separator (European convention)
- Space as thousands separator in the sats portion
- Fiat equivalent shown below when applicable (e.g. `€106,81`)

---

## Key coding rules

- Use design token variables consistently. **Do not invent new colours.**
- Every screen uses the **same topbar**. Do not deviate. Copy the exact spec from the specs file.
- Copy the `PeachIcon` SVG from an existing file — **never re-write it** from scratch.
- Each screen defines its own local `SideNav` + `NAV_ITEMS` + `NAV_ROUTES` (no shared component during prototype phase).
- Payment methods are referred to as **"PMs"** in conversation.
- The **cancellation flow does not exist** in Peach. Remove it if encountered; do not add it.

---

## Screens — build status

| Screen | Status | File |
|--------|--------|------|
| Landing / Auth | ✅ Built | `peach-auth.jsx` |
| Home Dashboard | ✅ Built + API wired | `peach-home.jsx` |
| Market View | ✅ Built + API wired | `peach-market-view.jsx` |
| Offer Creation | ✅ Built + API wired | `peach-offer-creation.jsx` |
| Trades Dashboard | ✅ Built + API wired | `peach-trades-dashboard.jsx` |
| Trade Execution (split panel + chat) | ✅ Built + API wired | `peach-trade-execution.jsx` |
| Dispute flow | ✅ Built (inline in trade execution) | `peach-trade-execution.jsx` |
| Settings | ✅ Built + API wired | `peach-settings.jsx` |
| Status cards (component library) | ✅ Built | `peach-status-cards.jsx` |
| Profile & Reputation | 🟡 Mostly done (in Home + Settings) | `peach-home.jsx`, `peach-settings.jsx` |
| Notifications / Activity feed | ⬜ Not started | — |
| Payment Methods management | ✅ Built | `peach-payment-methods.jsx` |
| Offer detail view (unmatched) | 🟡 Mostly done (inline in Market View popup) | `peach-market-view.jsx` |
| Trade request acceptance flow | ⬜ Not started | — |
| Refund flow (PSBT signing) | ⬜ Not started | — |

---

## Pending fixes

### Trade Execution (`peach-trade-execution.jsx`)
- Add a modal for when the seller funds the escrow with the **wrong amount** — options to continue (if amount is close enough) or request a refund.

---

## Authentication architecture

- Users create their identity **on the mobile app only** (no web registration). Identity = PeachID + seed + PGP key.
- To authenticate on the web, the browser displays a **QR code**. The user scans it with their mobile app, which completes an auth handshake via the Peach server.
- Result of a successful web session: browser holds the user's **PeachID, xpub, and PGP key** in session state.
- One browser session = one mobile device ID.
- The browser can **send and receive PGP-encrypted messages independently** — it does not need to call back to the mobile for crypto ops once it has the PGP key.
- The browser **never holds the private key or seed**. All Bitcoin signing stays on the mobile.
- Auth implementation is **pending backend engineer input** — do not build the QR/handshake flow until the protocol spec is confirmed.

---

## API integration — live data

- `api.js` covers all 63 endpoints. In Claude.ai preview, use inline `fetch()` calls — ES module imports break the preview renderer. Swap to `api.js` imports for local/production builds.
- **`/market/prices` response shape** — confirmed flat object: `{ "EUR": 55740.99, "GBP": 48812.94, ... }`. Currency codes are the keys.
- **Currency dropdowns must be driven by `/market/prices`** — never hardcode the currency list. The API response is the source of truth. Any currency added server-side will appear automatically in all dropdowns.

### Auth pattern (all private API calls)

Every screen reads `window.__PEACH_AUTH__` (set by the Dev Login regtest flow in `peach-auth.jsx`). Pattern:

```js
const auth = window.__PEACH_AUTH__ ?? null;
const base = auth?.baseUrl ?? 'https://api.peachbitcoin.com/v1';
const hdrs = auth ? { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' } : {};
```

- If `auth` is null → fall back to mock/static data, no crash.
- `auth.baseUrl` is the regtest URL in dev; swap for production URL at auth time.
- `handleLogout` clears `window.__PEACH_AUTH__ = null` and navigates to `"/"`.
- `isLoggedIn` state initialiser checks `window.__PEACH_AUTH__` first, then localStorage fallback.

### What's wired

| Screen | Live calls |
|--------|-----------|
| Home | `auth.profile` (already in auth object) |
| Trades Dashboard | `GET /offers/summary`, `GET /contracts/summary`, `GET /user/tradingLimit` |
| Market View | `POST /offer/search` (public), `GET /user/me/paymentMethods` |
| Trade Execution | `GET /contract/:id`, `GET /contract/:id/chat?page=0` |
| Settings — Payout Wallet | `PATCH /user` (payoutAddress) |
| Settings — Refund Address | `PATCH /user` (refundAddress) |
| Settings — Tx Batching | `PATCH /user/batching` |
| Offer Creation | `GET /user/me/paymentMethods` |

### What's NOT yet wired (crypto-gated)

- Offer submission (`POST /offer`) — requires escrowPublicKey / releaseAddress (key management)
- Chat send — requires PGP encryption per message
- Dispute open — requires symmetric key encrypted with platform PGP key
- Refund flow — requires client-side PSBT signing (bitcoinjs-lib)

---

## API & CORS

### The problem
The Peach API (`api.peachbitcoin.com`) does not send `Access-Control-Allow-Origin` headers. Every browser `fetch()` call to it is silently blocked by CORS — the `catch {}` swallows the error and the app falls back to hardcoded mock values. There is no indication of failure.

### The solution (two-layer)

**Development — Vite proxy**
`vite.config.js` has a `server.proxy` entry that forwards `/api/*` → `https://api.peachbitcoin.com/v1/*` through the Vite dev server (server-to-server, so CORS doesn't apply). All fetch calls in the screen files use the `VITE_API_BASE` env var (set to `/api` in `.env`), which routes through this proxy automatically.

**Production — Cloudflare Worker**
GitHub Pages is static — there's no server to proxy through. A Cloudflare Worker (`cloudflare/worker.js`) acts as the proxy: it receives requests, forwards them to the Peach API, and injects `Access-Control-Allow-Origin: *` on the response before returning it to the browser.

Worker URL: `https://peach-api-proxy.peachapi-proxy.workers.dev`
Wrangler config: `cloudflare/wrangler.toml`

`.env.production` sets `VITE_API_BASE` to the worker URL. Vite bakes this into the production bundle at build time (GitHub Actions runs `npm run build`, which reads `.env.production`). All fetch calls then go directly to the worker, which bypasses CORS.

### How all fetch calls are wired
Every API call in every screen uses:
```js
fetch(`${import.meta.env.VITE_API_BASE}/some/endpoint`)
```
- Local dev → `/api/some/endpoint` → Vite proxy → Peach API
- GitHub Pages → `https://peach-api-proxy.peachapi-proxy.workers.dev/some/endpoint` → Worker → Peach API

### Updating the worker
To redeploy the Cloudflare Worker after changes:
```bash
cd cloudflare
npx wrangler deploy
```

---

## Exporting files for GitHub

Claude.ai sandbox doesn't support `react-router-dom` or `import.meta.env`. The project files use sandbox-safe stubs instead. When Nux says **"export for GitHub"**, apply these two swaps across all 8 screen files that use them (not `peach-offer-cards.jsx` or `peach-status-cards.jsx`):

| Claude.ai version | GitHub version |
|---|---|
| `const useNavigate = () => () => {};` | `import { useNavigate } from "react-router-dom";` |
| `const API_BASE = "";` | *(delete the line)* |
| `` fetch(`${API_BASE}/…`) `` | `` fetch(`${import.meta.env.VITE_API_BASE}/…`) `` |

Files go into `src/screens/` in the repo. Everything else (`App.jsx`, `main.jsx`, `.env`, `.env.production`, `vite.config.js`, Cloudflare worker) stays untouched.

---

## What to read at session start

1. This file (`CLAUDE.md`)
2. `peach-api-reference.md` — before implementing any data fetching
3. `peach-backlog.md` — before starting any new screen
4. The relevant `.jsx` file if continuing work on an existing screen
