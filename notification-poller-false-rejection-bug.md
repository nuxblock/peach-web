# Notification poller — false "Trade request declined" on accepted outbound requests

## Status

🐛 **Unresolved.** Two-tick confirmation + `c.offerId` linkage shipped but still fires false rejections. Needs API payload inspection to determine the correct contract→offer linkage field.

## Symptom

When the user sends a trade request to someone else's offer and the offer owner **accepts** it (creating a contract), the bell fires `"Trade request declined" – "The offer owner rejected your request."` instead of (or in addition to) the correct contract-acceptance notification.

Observed live on 2026-05-13:
- Sent request to offer `P-1F4` (decimal id `500`) → accepted into contract `PC-84D-84C` (decimal id `"2125-2124"`) → got "declined" bell.
- Repeat with `P-1FF` (`511`) → contract `PC-84F-84E` (`"2127-2126"`) → got "declined" bell.

Neither the user's outbound offer id appears in the contract id when split by `-`, and adding `c.offerId` as a primary signal didn't catch it either (still firing in production).

## Where it fires

Single emitter: [`src/hooks/useNotifications.js`](src/hooks/useNotifications.js) ~line 535, inside the outbound-rejection diff (`if (_pollTick % 2 === 0)` block). Grep confirms no other source of the string `"Trade request declined"`.

## What we've already tried (and why each was insufficient)

1. **Two-tick confirmation** (`_rejectionCandidates` set, persisted in baseline). Suppresses notifications until the offer is missing AND not in any contract on TWO consecutive rejection-check ticks (~30 s apart). Helps with short propagation races but doesn't fix the case where the contract IS in `/contracts/summary` but the linkage check still fails.

2. **`c.offerId` as primary linkage signal** + dash-split as fallback, in both auto-dismiss (~line 263) and rejection-detection (~line 525). Based on the mobile type [`ContractSummary.offerId`](file:///home/steadyprodos/Documents/PROJECTS/PEACH/CODE/peach-app/peach-app/peach-api/src/@types/contract.ts#L89-L109) and mobile usage in `useTradeNavigation.ts:27`. Did not resolve in practice → either `c.offerId` doesn't equal the user's outbound offer id, or it isn't populated on this code path.

## Why the dash-split was wrong

The repo has a longstanding assumption "contract IDs are `buyOfferId-sellOfferId`, so split by `-` and match either half" — repeated verbatim in:
- [`src/hooks/useNotifications.js:263`](src/hooks/useNotifications.js#L263) and `:528`
- [`src/screens/trades-dashboard/index.jsx:1764–1768`](src/screens/trades-dashboard/index.jsx#L1764-L1768) (navigate from offer to contract)
- [`src/components/RequestedOfferPopup.jsx:201`](src/components/RequestedOfferPopup.jsx#L201) (popup-side acceptance detection)

Empirically wrong on user's data: `P-1F4 = 500`, contract `PC-84D-84C = "2125-2124"`. The split yields `{"2125", "2124"}`, neither equal to `500`. So either (a) the contract id format changed at some point, or (b) it was never offer ids and the convention was assumed without verification. Both `trades-dashboard` and `RequestedOfferPopup` carry the same flaw — they have the same incorrect assumption but operate in different features.

## Next investigation step

Add a temporary `console.log` in `useNotifications.js` right after `/contracts/summary` is parsed (~line 250) to dump:
- `c.id`
- `c.offerId`
- `c.type` (`"bid"` | `"ask"`)
- `c.buyOffer69Id` if present (it's on the full `Contract` type but might be omitted from `ContractSummary`)
- any other field that could carry the outbound-offer linkage

Also log `_prevSentRequests` entries on the same tick so we can compare directly. Sample one trade-request-accepted cycle and compare ids.

Hypotheses to validate:
- (A) `c.offerId` is the user's **own** offer in the trade (auto-created buy offer for outbound requesters), not the offer they requested from. If so, we need a different field — possibly need to fetch `GET /contract/:id` to read `c.buyOffer69Id` (would be one extra request per new contract, acceptable).
- (B) The original sell offer id is renumbered when the contract is created (e.g. promoted to a new sequential id). In which case there's no static linkage and we'd need to track via `tradeRequestId` or similar.
- (C) `c.offerId` IS the right field but isn't populated on `/contracts/summary` responses (mobile types may be aspirational). Same fix as (A): fetch full contract to read the linkage.

## Workaround for now

Live with the noise: a real rejection and a false acceptance-as-rejection are indistinguishable to the user, but the correct contract-acceptance notification still fires ~15 s later via the contract status diff (status → STATUS_NOTIF lookup, e.g. `fundEscrow → "It's a match! Create escrow"`). So users see both — a phantom "declined" and the genuine contract notification — for the same accepted request.

## Knock-on fixes once root-caused

When the right linkage field is identified, apply the same fix in:
1. [`src/hooks/useNotifications.js`](src/hooks/useNotifications.js) — both `offerIdsWithContract` builds (~line 264 and ~line 527).
2. [`src/screens/trades-dashboard/index.jsx:1764–1768`](src/screens/trades-dashboard/index.jsx#L1764-L1768).
3. [`src/components/RequestedOfferPopup.jsx:201`](src/components/RequestedOfferPopup.jsx#L201).

## Related

- [`notification-poller-backend-asks.md`](notification-poller-backend-asks.md) — the `totalTradeRequests` counter request (✅ shipped).
- The two-tick confirmation logic in [`useNotifications.js`](src/hooks/useNotifications.js) (lines ~525–558) — keep it, it still helps for genuine propagation races.
