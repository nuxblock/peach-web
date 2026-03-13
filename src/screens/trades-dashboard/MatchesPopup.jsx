// ─── TRADES DASHBOARD — MATCHES POPUP ──────────────────────────────────────
// Extracted from peach-trades-dashboard.jsx
// Contains: MatchesPopup component + helper functions used by the popup
//           and by the main component's fetch logic.
// ─────────────────────────────────────────────────────────────────────────────
import { SatsAmount, IcoBtc } from "../../components/BitcoinAmount.jsx";
import { relTime as relativeTime } from "../../utils/format.js";
import { AVATAR_COLORS } from "../../data/mockData.js";
import Avatar from "../../components/Avatar.jsx";
import { PeachRating, Badge, satsToFiat } from "./components.jsx";


// ─── HELPER FUNCTIONS (also used by index.jsx fetch logic) ──────────────────

export function formatTradeId(id) {
  const s = String(id);
  // Convert decimal IDs to hex (matching mobile app's contractIdToHex / offerIdToHex)
  // "1361-1360" → "PC‑551‑550", "1257" → "PC‑4E9"
  const parts = s.split("-").map(n => parseInt(n, 10).toString(16).toUpperCase());
  return "PC\u2011" + parts.join("\u2011");
}

export function formatPeachName(rawId) {
  if (!rawId || rawId === "unknown") return "Unknown";
  // "03c292c382..." → "Peach03C292C3" (first 8 hex chars, uppercase)
  return "Peach" + rawId.slice(0, 8).toUpperCase();
}

export function transformMatch(apiMatch) {
  const u = apiMatch.user ?? {};
  const peachId = u.id ?? "unknown";
  const displayName = formatPeachName(peachId);
  const initials = displayName.slice(-2).toUpperCase();
  const color = AVATAR_COLORS[
    peachId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];
  const badges = (u.medals ?? []).map(m => {
    if (m === "fastTrader") return "fast";
    if (m === "superTrader") return "supertrader";
    return m;
  });
  const mop = apiMatch.meansOfPayment ?? {};
  const currencies = Object.keys(mop);
  const methods = [...new Set(Object.values(mop).flat())];
  return {
    offerId: apiMatch.offerId,
    requestedAt: new Date(apiMatch.creationDate ?? Date.now()).getTime(),
    user: {
      name: displayName,
      initials,
      color,
      rep: u.peachRating ?? u.rating ?? 0,
      trades: u.trades ?? 0,
      badges,
    },
    amount: apiMatch.amount ?? 0,
    premium: apiMatch.premium ?? 0,
    methods,
    currencies,
    _raw: {
      matchedPrice: apiMatch.matchedPrice,
      prices: apiMatch.prices,
      selectedCurrency: apiMatch.selectedCurrency,
      selectedPaymentMethod: apiMatch.selectedPaymentMethod,
      symmetricKeyEncrypted: apiMatch.symmetricKeyEncrypted,
      symmetricKeySignature: apiMatch.symmetricKeySignature,
      instantTrade: apiMatch.instantTrade,
      pgpPublicKeys: u.pgpPublicKeys,
    },
  };
}

export function transformTradeRequest(tr, offer, userProfile) {
  const peachId = tr.userId ?? "unknown";
  const displayName = formatPeachName(peachId);
  const initials = displayName.slice(-2).toUpperCase();
  const color = AVATAR_COLORS[
    peachId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];
  const u = userProfile ?? {};
  const badges = (u.medals ?? []).map(m => {
    if (m === "fastTrader") return "fast";
    if (m === "superTrader") return "supertrader";
    return m;
  });
  return {
    offerId: String(tr.id), // trade request ID
    requestedAt: new Date(tr.creationDate ?? Date.now()).getTime(),
    user: {
      name: displayName,
      initials,
      color,
      rep: u.peachRating ?? u.rating ?? 0,
      trades: u.trades ?? 0,
      badges,
    },
    amount: offer.amount ?? 0,
    premium: offer.premium ?? 0,
    methods: tr.paymentMethod ? [tr.paymentMethod] : [],
    currencies: tr.currency ? [tr.currency] : [],
    _raw: {
      matchedPrice: tr.price,
      prices: tr.currency ? { [tr.currency]: tr.price } : {},
      selectedCurrency: tr.currency,
      selectedPaymentMethod: tr.paymentMethod,
      symmetricKeyEncrypted: tr.symmetricKeyEncrypted,
      symmetricKeySignature: tr.symmetricKeySignature,
      instantTrade: false,
      pgpPublicKeys: [],
      // v069-specific: counterparty already sent their encrypted payment data
      paymentDataEncrypted: tr.paymentDataEncrypted,
      paymentDataSignature: tr.paymentDataSignature,
      isTradeRequest: true, // flag to use v069 accept endpoint
      tradeRequestUserId: peachId,
    },
  };
}


// ─── MATCHES POPUP COMPONENT ────────────────────────────────────────────────
// Props:
//   trade           — the offer object that the popup is showing matches for
//   matches         — array of match objects
//   matchDetail     — currently selected match (detail view) or null
//   matchConfirm    — match pending confirmation or null
//   matchError      — error message or null
//   matchesLoading  — boolean
//   setMatchDetail  — setter
//   setMatchConfirm — setter
//   onClose         — close popup handler
//   onSkip          — (trade, match) handler
//   onAccept        — (trade, match) handler
//   onConfirmAccept — (trade, match) handler
// ─────────────────────────────────────────────────────────────────────────────
export default function MatchesPopup({
  trade, matches, matchDetail, matchConfirm, matchError, matchesLoading,
  setMatchDetail, setMatchConfirm, onClose, onSkip, onAccept, onConfirmAccept,
}) {
  const isBuy = trade.direction === "buy";

  // ── Confirmation dialog ──
  if (matchConfirm) {
    const m = matchConfirm;
    return (
      <div className="matches-overlay" onClick={onClose}>
        <div className="matches-popup" onClick={e => e.stopPropagation()}>
          <div className="matches-header">
            <span style={{fontWeight:800,fontSize:"1.05rem"}}>Confirm trade</span>
            <button className="matches-close" onClick={onClose}>✕</button>
          </div>
          <div style={{padding:"20px 24px",textAlign:"center"}}>
            <Avatar initials={m.user.initials} color={m.user.color} size={56}/>
            <div style={{fontWeight:800,fontSize:"1rem",marginTop:12}}>
              Accept trade with {m.user.name}?
            </div>
            <div style={{fontSize:".82rem",color:"var(--black-65)",marginTop:6}}>
              This will create a contract. Other requesters will be automatically declined.
            </div>
            <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"center"}}>
              <button className="match-btn-skip" onClick={() => setMatchConfirm(null)}>Cancel</button>
              <button className="match-btn-accept" onClick={() => onConfirmAccept(trade, m)}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Detail view ──
  if (matchDetail) {
    const m = matchDetail;
    const reqAgo = relativeTime(m.requestedAt);
    return (
      <div className="matches-overlay" onClick={onClose}>
        <div className="matches-popup" onClick={e => e.stopPropagation()}>
          <div className="matches-header">
            <button className="matches-back" onClick={() => setMatchDetail(null)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="10,2 4,8 10,14"/></svg>
            </button>
            <span style={{fontWeight:800,fontSize:"1.05rem"}}>Review trader</span>
            <button className="matches-close" onClick={onClose}>✕</button>
          </div>
          <div style={{padding:"16px 24px 24px"}}>
            {/* Peer profile */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:20}}>
              <Avatar initials={m.user.initials} color={m.user.color} size={56}/>
              <div style={{fontWeight:800,fontSize:"1rem"}}>{m.user.name}</div>
              <PeachRating rep={m.user.rep} size={20}/>
              <span style={{fontSize:".82rem",color:"var(--black-65)"}}>{m.user.trades} trades</span>
              {m.user.badges.length > 0 && (
                <div style={{display:"flex",gap:6}}>
                  {m.user.badges.includes("supertrader") && <Badge label="supertrader" icon="☆"/>}
                  {m.user.badges.includes("fast") && <Badge label="fast" icon="⚡"/>}
                </div>
              )}
            </div>
            {/* Trade terms */}
            <div className="match-detail-terms">
              <div className="match-detail-row">
                <span className="match-detail-label">Amount</span>
                <SatsAmount sats={m.amount}/>
              </div>
              {(() => {
                const cur = m.currencies[0] ?? "EUR";
                const sym = cur === "CHF" ? "₣" : cur === "GBP" ? "£" : "€";
                const matchedPrice = m._raw.matchedPrice;
                return (
                  <div className="match-detail-row">
                    <span className="match-detail-label">You pay</span>
                    <span style={{fontWeight:700}}>{sym}{matchedPrice != null ? Number(matchedPrice).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : satsToFiat(m.amount)}</span>
                  </div>
                );
              })()}
              <div className="match-detail-row">
                <span className="match-detail-label">Premium</span>
                <span style={{fontWeight:700,color:m.premium < 0 ? "#65A519" : m.premium > 0 ? "#DF321F" : "var(--black)"}}>
                  {m.premium > 0 ? "+" : ""}{m.premium.toFixed(2)}%
                </span>
              </div>
              <div className="match-detail-row">
                <span className="match-detail-label">Payment</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {m.methods.map(pm => <span key={pm} className="tag tag-method">{pm}</span>)}
                  {m.currencies.map(c => <span key={c} className="tag tag-currency">{c}</span>)}
                </div>
              </div>
              <div className="match-detail-row">
                <span className="match-detail-label">Requested</span>
                <span style={{fontSize:".82rem",color:"var(--black-65)"}}>{reqAgo}</span>
              </div>
            </div>
            {/* Error */}
            {matchError && (
              <div style={{background:"var(--error-bg)",color:"var(--error)",borderRadius:10,padding:"8px 14px",fontSize:".82rem",fontWeight:600,marginTop:12}}>
                {matchError}
              </div>
            )}
            {/* Actions */}
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button className="match-btn-skip" onClick={() => onSkip(trade, m)}>Skip</button>
              <button className="match-btn-accept" onClick={() => onAccept(trade, m)}>Accept trade</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="matches-overlay" onClick={onClose}>
      <div className="matches-popup" onClick={e => e.stopPropagation()}>
        <div className="matches-header">
          <span style={{fontWeight:800,fontSize:"1.05rem"}}>Trade requests</span>
          <span style={{fontSize:".78rem",fontFamily:"monospace",color:"var(--black-65)"}}>{String(trade.id).toUpperCase()}</span>
          <button className="matches-close" onClick={onClose}>✕</button>
        </div>
        {/* Offer summary */}
        <div style={{padding:"8px 24px 12px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span className={`direction-badge direction-${isBuy ? "buy" : "sell"}`}>
            {isBuy ? "BUY" : "SELL"}
          </span>
          <SatsAmount sats={trade.amount}/>
          {trade.premium !== undefined && (
            <span style={{fontSize:".78rem",fontWeight:700,
              color: isBuy
                ? (trade.premium < 0 ? "#65A519" : "#DF321F")
                : (trade.premium > 0 ? "#65A519" : "#DF321F"),
            }}>
              {trade.premium > 0 ? "+" : ""}{trade.premium.toFixed(2)}%
            </span>
          )}
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {(trade.methods || []).map(m => <span key={m} className="tag tag-method">{m}</span>)}
          </div>
        </div>
        {/* Count / Loading */}
        <div style={{padding:"0 24px 12px",fontSize:".85rem",fontWeight:600,color:"var(--black-75)"}}>
          {matchesLoading && matches.length === 0
            ? "Loading matches\u2026"
            : matches.length === 0
              ? "No traders found"
              : `${matches.length} trader${matches.length !== 1 ? "s" : ""} want${matches.length === 1 ? "s" : ""} to trade with you`
          }
        </div>
        {matchError && (
          <div style={{padding:"0 24px 12px"}}>
            <div style={{background:"var(--error-bg)",color:"var(--error)",borderRadius:10,padding:"8px 14px",fontSize:".82rem",fontWeight:600}}>
              {matchError}
            </div>
          </div>
        )}
        {/* Match rows */}
        <div className="match-list">
          {matches.map(m => (
            <div key={m.offerId} className="match-row" onClick={() => setMatchDetail(m)}>
              <Avatar initials={m.user.initials} color={m.user.color} size={36}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:".88rem"}}>{m.user.name}</span>
                  <PeachRating rep={m.user.rep}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                  <span style={{fontSize:".72rem",color:"var(--black-65)"}}>{m.user.trades} trades</span>
                  {m.user.badges.includes("supertrader") && <Badge label="supertrader" icon="☆"/>}
                  {m.user.badges.includes("fast") && <Badge label="fast" icon="⚡"/>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
                <span style={{fontSize:".72rem",color:"var(--black-65)"}}>{relativeTime(m.requestedAt)}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--black-65)" strokeWidth="2" strokeLinecap="round"><polyline points="5,2 10,7 5,12"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
