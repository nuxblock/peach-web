import { useState } from "react";
import { SatsAmount } from "../components/BitcoinAmount.jsx";

// ─── DESIGN TOKENS (from Peach design system) ────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary:       #F56522;
    --primary-dark:  #C45104;
    --primary-mild:  #FCCCB6;
    --primary-bg:    #FEEDE5;
    --success:       #65A519;
    --success-bg:    #F2F9E7;
    --success-mild:  #DDEFC3;
    --warning:       #F3B71A;
    --warning-bg:    #FEFCE5;
    --error:         #DF321F;
    --error-bg:      #FFE6E1;
    --info:          #037DB5;
    --info-bg:       #D7F2FE;
    --bitcoin:       #F7931A;
    --black:         #2B1911;
    --black-90:      #402F28;
    --black-75:      #624D44;
    --black-65:      #7D675E;
    --black-10:      #EAE3DF;
    --black-5:       #F4EEEB;
    --bg:            #FFF9F6;
    --surface:       #FFFFFF;
    --grad:          linear-gradient(90deg, #FF4D42, #FF7A50, #FFA24C);
    --font:          'Baloo 2', cursive;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--black); }

  /* ── Layout ── */
  .page { padding: 40px; max-width: 1100px; margin: 0 auto; }
  .section-title {
    font-size: .65rem; font-weight: 800; letter-spacing: .1em;
    text-transform: uppercase; color: var(--black-65);
    margin-bottom: 16px; margin-top: 40px;
  }
  .section-title:first-child { margin-top: 0; }
  .cards-row {
    display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start;
  }
  .divider {
    height: 1px; background: var(--black-10); margin: 48px 0;
  }
  .variant-label {
    font-size: .62rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--black-65);
    margin-bottom: 10px;
  }
  .variant-group { display: flex; flex-direction: column; }

  /* ── SHARED TAG STYLES ── */
  .tag {
    display: inline-flex; align-items: center; border-radius: 999px;
    padding: 2px 9px; font-size: .68rem; font-weight: 600; white-space: nowrap;
  }
  .tag-method  { background: var(--black-5); color: var(--black-75); }
  .tag-currency{ background: var(--primary-bg); color: var(--primary-dark); }
  .dir-buy  { background: var(--success-bg); color: var(--success); }
  .dir-sell { background: var(--error-bg);   color: var(--error); }

  /* ────────────────────────────────────────────────────────────────────────────
     VARIANT A — Current (web desktop)
  ──────────────────────────────────────────────────────────────────────────── */
  .card-current {
    background: var(--surface); border: 1px solid var(--black-10);
    border-radius: 16px; overflow: hidden; width: 320px;
    display: flex; flex-direction: column;
    transition: box-shadow .15s, transform .1s; cursor: pointer;
  }
  .card-current:hover { box-shadow: 0 4px 20px rgba(0,0,0,.09); transform: translateY(-1px); }
  .card-current.urgent { border-left: 3px solid var(--primary); }
  .card-current .c-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px 0; gap: 8px;
  }
  .card-current .c-body   { padding: 12px 16px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .card-current .c-footer {
    padding: 10px 16px 14px; display: flex; align-items: center;
    justify-content: space-between; gap: 8px;
    border-top: 1px solid var(--black-5); flex-wrap: wrap;
  }
  .status-chip {
    display: inline-flex; align-items: center; border-radius: 999px;
    padding: 2px 10px; font-size: .68rem; font-weight: 700; gap: 4px;
  }
  .c-amount { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
  .amt-sats { font-size: .95rem; font-weight: 800; }
  .amt-fiat { font-size: .78rem; color: var(--black-65); font-weight: 500; }
  .c-time   { display: flex; align-items: center; gap: 5px; font-size: .74rem; color: var(--black-65); font-weight: 500; }
  .c-tags   { display: flex; gap: 5px; flex-wrap: wrap; }
  .btn-action {
    border: none; border-radius: 999px; font-family: var(--font);
    font-size: .75rem; font-weight: 700; padding: 5px 14px; cursor: pointer;
    transition: all .15s;
  }

  /* ────────────────────────────────────────────────────────────────────────────
     VARIANT B — Current (mobile)
  ──────────────────────────────────────────────────────────────────────────── */
  .card-mobile {
    background: var(--surface); border: 1.5px solid var(--black-10);
    border-radius: 14px; width: 320px; overflow: hidden; cursor: pointer;
  }
  .card-mobile .m-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 14px 10px;
  }
  .m-id    { font-size: .85rem; font-weight: 700; color: var(--black); }
  .m-date  { font-size: .72rem; color: var(--black-65); margin-top: 2px; }
  .m-right { text-align: right; }
  .m-sats  { font-size: .85rem; font-weight: 700; }
  .m-fiat  { font-size: .72rem; color: var(--black-65); margin-top: 2px; }
  .card-mobile .m-cta {
    margin: 0 10px 10px; border-radius: 10px;
    padding: 11px 14px; text-align: center;
    font-size: .85rem; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    border: none; font-family: var(--font); width: calc(100% - 20px);
  }

  /* ────────────────────────────────────────────────────────────────────────────
     VARIANT 1 — "Structured"
     A clean two-zone card: info top half, action bottom half.
     Slightly taller than wide is avoided by keeping padding tight.
  ──────────────────────────────────────────────────────────────────────────── */
  .card-v1 {
    background: var(--surface); border: 1.5px solid var(--black-10);
    border-radius: 14px; width: 300px; overflow: hidden; cursor: pointer;
    transition: box-shadow .18s, transform .12s;
  }
  .card-v1:hover { box-shadow: 0 6px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
  .card-v1 .v1-top {
    padding: 13px 15px 11px;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .card-v1 .v1-left { display: flex; flex-direction: column; gap: 6px; }
  .v1-id   { font-size: .72rem; font-weight: 700; color: var(--black-65); font-family: monospace; letter-spacing: .02em; }
  .v1-amount {
    font-size: 1rem; font-weight: 800; color: var(--black);
    display: flex; align-items: baseline; gap: 5px;
  }
  .v1-amount small { font-size: .72rem; font-weight: 600; color: var(--black-65); }
  .v1-premium { font-size: .72rem; font-weight: 700; }
  .card-v1 .v1-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
  .v1-dir {
    border-radius: 999px; padding: 2px 10px;
    font-size: .65rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase;
  }
  .v1-fiat { font-size: .82rem; font-weight: 700; color: var(--black-75); }
  .v1-date { font-size: .68rem; color: var(--black-65); }
  .card-v1 .v1-methods {
    padding: 0 15px 11px; display: flex; gap: 5px; flex-wrap: wrap;
  }
  .card-v1 .v1-cta {
    border-top: 1.5px solid var(--black-5);
    padding: 10px 15px 12px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .v1-status-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    margin-right: 6px; display: inline-block;
  }
  .v1-status-label { font-size: .75rem; font-weight: 700; display: flex; align-items: center; }
  .v1-btn {
    border: none; border-radius: 999px; font-family: var(--font);
    font-size: .75rem; font-weight: 800; padding: 6px 14px; cursor: pointer;
    transition: all .15s; white-space: nowrap;
  }
  .v1-btn:hover { filter: brightness(1.05); }

  /* ────────────────────────────────────────────────────────────────────────────
     VARIANT 2 — "Accent bar"
     A colored left border and colored CTA strip signal urgency at a glance.
  ──────────────────────────────────────────────────────────────────────────── */
  .card-v2 {
    background: var(--surface); border: 1.5px solid var(--black-10);
    border-radius: 14px; width: 300px; overflow: hidden; cursor: pointer;
    transition: box-shadow .18s, transform .12s;
    display: flex;
  }
  .card-v2:hover { box-shadow: 0 6px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
  .card-v2 .v2-bar {
    width: 5px; flex-shrink: 0; border-radius: 0;
  }
  .card-v2 .v2-body {
    flex: 1; padding: 0; display: flex; flex-direction: column;
  }
  .card-v2 .v2-main {
    padding: 12px 14px 10px;
    display: flex; justify-content: space-between; gap: 8px;
  }
  .v2-id { font-size: .7rem; font-weight: 700; color: var(--black-65); font-family: monospace; }
  .v2-amounts { margin-top: 4px; }
  .v2-sats { font-size: .98rem; font-weight: 800; color: var(--black); }
  .v2-fiat { font-size: .75rem; font-weight: 600; color: var(--black-65); }
  .v2-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .v2-premium { font-size: .72rem; font-weight: 700; }
  .v2-date    { font-size: .68rem; color: var(--black-65); }
  .card-v2 .v2-methods {
    padding: 0 14px 10px; display: flex; gap: 5px; flex-wrap: wrap;
  }
  .card-v2 .v2-strip {
    border-top: 1.5px solid var(--black-5);
    padding: 8px 14px; display: flex; align-items: center; gap: 8px;
  }
  .v2-strip-icon { font-size: 1rem; flex-shrink: 0; }
  .v2-strip-label { font-size: .78rem; font-weight: 700; flex: 1; }
  .v2-strip-arrow {
    font-size: .85rem; font-weight: 700; opacity: .5; flex-shrink: 0;
  }

  /* ────────────────────────────────────────────────────────────────────────────
     VARIANT 3 — "Pill CTA"
     Compact card, status is communicated via a full-width pill button at bottom.
     Closest to the mobile app feel but sized for desktop.
  ──────────────────────────────────────────────────────────────────────────── */
  .card-v3 {
    background: var(--surface); border: 1.5px solid var(--black-10);
    border-radius: 16px; width: 300px; overflow: hidden; cursor: pointer;
    transition: box-shadow .18s, transform .12s;
  }
  .card-v3:hover { box-shadow: 0 6px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
  .card-v3 .v3-main {
    padding: 13px 15px 10px;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .v3-left {}
  .v3-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .v3-id   { font-size: .7rem; font-weight: 700; color: var(--black-65); font-family: monospace; }
  .v3-date { font-size: .68rem; color: var(--black-65); }
  .v3-sats { font-size: 1rem; font-weight: 800; color: var(--black); }
  .v3-sats small { font-size: .7rem; font-weight: 600; color: var(--black-65); margin-left: 3px; }
  .v3-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .v3-fiat    { font-size: .85rem; font-weight: 700; color: var(--black-75); }
  .v3-premium { font-size: .72rem; font-weight: 700; }
  .card-v3 .v3-methods {
    padding: 0 15px 10px; display: flex; gap: 5px; flex-wrap: wrap;
  }
  .card-v3 .v3-pill {
    margin: 0 10px 10px; border-radius: 12px;
    padding: 10px 14px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    border: none; font-family: var(--font); font-size: .82rem; font-weight: 800;
    cursor: pointer; width: calc(100% - 20px); transition: filter .15s;
  }
  .card-v3 .v3-pill:hover { filter: brightness(1.04); }

  /* ── Clock SVG inline ── */
  .ico { vertical-align: middle; display: inline-block; }
`;

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const IcoClock  = ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="ico"><circle cx="6" cy="6" r="4.5"/><path d="M6 3.2v2.8l1.8 1.3"/></svg>;
const IcoWallet = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="ico"><rect x="1.5" y="3.5" width="11" height="8" rx="1.5"/><path d="M1.5 6h11"/><circle cx="9.5" cy="8" r=".8" fill="currentColor" stroke="none"/></svg>;
const IcoWait   = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="ico"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3l2 1.5"/></svg>;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const WAIT_FOR_BUYER = {
  id: "P-4EC",
  date: "02/25/26",
  sats: 36074,
  fiat: "21.94",
  currency: "EUR",
  premium: 5.5,
  methods: ["SEPA", "Revolut"],
  direction: "sell",
};

const MAKE_PAYMENT = {
  id: "PC-4EC-4F4",
  date: "02/26/26",
  sats: 36074,
  fiat: "21.94",
  currency: "EUR",
  premium: 5.5,
  methods: ["SEPA", "Revolut"],
  direction: "buy",
  deadline: "6h 32m",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(2)+"M";
  if (n >= 1_000)     return n.toLocaleString("de-DE");
  return String(n);
}

// ═════════════════════════════════════════════════════════════════════════════
// CURRENT CARDS (Desktop web + Mobile)
// ═════════════════════════════════════════════════════════════════════════════

function CurrentDesktopCard({ data, status }) {
  const isPayment = status === "make_payment";
  const chipStyle = isPayment
    ? { background: "#FEEDE5", color: "#C45104" }
    : { background: "#D7F2FE", color: "#037DB5" };
  const chipLabel = isPayment ? "Awaiting Payment" : "Pending Match";

  return (
    <div className={`card-current${isPayment ? " urgent" : ""}`}>
      <div className="c-header">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span className={`tag dir-${data.direction}`}>{data.direction.toUpperCase()}</span>
          <span className="status-chip" style={chipStyle}>
            {isPayment ? "● " : "● "}{isPayment ? "Awaiting Payment" : "Waiting for a match"}
          </span>
        </div>
      </div>
      <div className="c-body">
        <div style={{ fontSize:".8rem", color:"var(--black-65)", fontStyle:"italic" }}>
          {isPayment ? "" : "Waiting for a buyer…"}
          {isPayment && <span style={{ fontWeight:600, color:"var(--black-75)" }}>Peer #4EC</span>}
        </div>
        <div className="c-amount">
          <SatsAmount sats={data.sats}/>
          <span style={{ fontSize:".72rem", fontWeight:700, color: data.premium > 0 ? "var(--error)" : "var(--success)" }}>
            +{data.premium}%
          </span>
        </div>
        <div className="c-tags">
          {data.methods.map(m => <span key={m} className="tag tag-method">{m}</span>)}
          <span className="tag tag-currency">{data.currency}</span>
        </div>
        {isPayment && (
          <div style={{ fontSize:".78rem", color:"var(--black-65)" }}>
            Fiat: <strong style={{ color:"var(--black)" }}>€{data.fiat}</strong>
          </div>
        )}
      </div>
      <div className="c-footer">
        <div className="c-time">
          <IcoClock size={13}/>
          {isPayment ? `${data.deadline} remaining` : "Expires in 23h 15m"}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {isPayment ? (
            <button className="btn-action" style={{ background:"var(--primary)", color:"white" }}>Make Payment</button>
          ) : (
            <>
              <button className="btn-action" style={{ background:"var(--black-5)", color:"var(--black-75)", border:"1px solid var(--black-10)" }}>Edit Offer</button>
              <button className="btn-action" style={{ background:"var(--error-bg)", color:"var(--error)", border:"1px solid var(--error)" }}>Withdraw</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CurrentMobileCard({ data, status }) {
  const isPayment = status === "make_payment";
  const ctaStyle = isPayment
    ? { background:"#F56522", color:"white" }
    : { background:"#FCCCB6", color:"#963600" };
  const ctaLabel = isPayment ? "$ make payment" : "⟳ waiting for a match";

  return (
    <div className="card-mobile" style={{ maxWidth: 320 }}>
      <div className="m-top">
        <div>
          <div className="m-id">{data.id}</div>
          <div className="m-date">{data.date}</div>
        </div>
        <div className="m-right">
          <div className="m-sats">
            <SatsAmount sats={data.sats} size="sm"/>
          </div>
          <div className="m-fiat" style={{ textAlign:"right" }}>+{data.premium}% premium</div>
        </div>
      </div>
      <button className="m-cta" style={ctaStyle}>{ctaLabel}</button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// VARIANT 1 — "Structured"
// ═════════════════════════════════════════════════════════════════════════════
function V1Card({ data, status }) {
  const isPayment = status === "make_payment";

  // Waiting: grey strip, muted — no call to action urgency
  // Payment: strong orange strip, solid button
  const stripBg    = isPayment ? "var(--primary-bg)" : "var(--black-5)";
  const stripBorder= isPayment ? "none" : "none";
  const dotColor   = isPayment ? "var(--primary)" : "#C4B5AE";
  const labelColor = isPayment ? "var(--primary-dark)" : "var(--black-65)";
  const statusLabel= isPayment ? "Make Payment" : "Waiting for a match";
  const btnStyle   = isPayment
    ? { background:"var(--primary)", color:"white", boxShadow:"0 2px 10px rgba(245,101,34,.35)" }
    : { background:"transparent", color:"var(--black-65)", border:"1px solid var(--black-10)", cursor:"default", opacity:.7 };
  const btnLabel   = isPayment ? "Pay Now →" : "Waiting…";

  return (
    <div className="card-v1">
      <div className="v1-top">
        <div className="v1-left">
          <div className="v1-id">{data.id}</div>
          <div className="v1-amount">
            <SatsAmount sats={data.sats}/>
          </div>
          <span className="v1-premium" style={{ color: isPayment ? "var(--error)" : "var(--success)" }}>
            +{data.premium}% premium
          </span>
        </div>
        <div className="v1-right">
          <span className={`tag dir-${data.direction} v1-dir`}>{data.direction.toUpperCase()}</span>
          <span className="v1-fiat">€{data.fiat}</span>
          <span className="v1-date">{data.date}</span>
        </div>
      </div>
      <div className="v1-methods">
        {data.methods.map(m => <span key={m} className="tag tag-method">{m}</span>)}
        <span className="tag tag-currency">{data.currency}</span>
      </div>
      <div className="v1-cta" style={{ background: stripBg }}>
        <span className="v1-status-label" style={{ color: labelColor }}>
          <span className="v1-status-dot" style={{ background: dotColor }}/>
          {statusLabel}
        </span>
        <button className="v1-btn" style={btnStyle}>{btnLabel}</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// VARIANT 2 — "Accent bar"
// ═════════════════════════════════════════════════════════════════════════════
function V2Card({ data, status }) {
  const isPayment = status === "make_payment";

  // Waiting: grey left bar, near-white strip, muted label — clearly passive
  // Payment: bright orange bar, orange-tinted strip, strong label
  const barColor   = isPayment ? "var(--primary)" : "#D9CFC9";
  const stripBg    = isPayment ? "var(--primary-bg)" : "var(--black-5)";
  const stripColor = isPayment ? "var(--primary-dark)" : "var(--black-65)";
  const stripIcon  = isPayment ? <IcoWallet size={15}/> : <IcoWait size={15}/>;
  const stripLabel = isPayment ? "Make payment to continue" : "Waiting for a match";

  return (
    <div className="card-v2">
      <div className="v2-bar" style={{ background: barColor }}/>
      <div className="v2-body">
        <div className="v2-main">
          <div>
            <div className="v2-id">{data.id} · {data.date}</div>
            <div className="v2-amounts">
              <div className="v2-sats"><SatsAmount sats={data.sats}/></div>
              <div className="v2-fiat">≈ €{data.fiat}</div>
            </div>
          </div>
          <div className="v2-right">
            <span className={`tag dir-${data.direction}`}>{data.direction.toUpperCase()}</span>
            <span className="v2-premium" style={{ color: isPayment ? "var(--error)" : "var(--success)" }}>
              +{data.premium}%
            </span>
            <span className="v2-date" style={{ display:"flex", alignItems:"center", gap:3 }}>
              <IcoClock size={11}/> {isPayment ? data.deadline : "23h 15m"}
            </span>
          </div>
        </div>
        <div className="v2-methods">
          {data.methods.map(m => <span key={m} className="tag tag-method">{m}</span>)}
          <span className="tag tag-currency">{data.currency}</span>
        </div>
        <div className="v2-strip" style={{ background: stripBg, color: stripColor, borderTop: isPayment ? "1.5px solid var(--primary-mild)" : "1.5px solid var(--black-10)" }}>
          <span style={{ color: stripColor, opacity: isPayment ? 1 : 0.5 }}>{stripIcon}</span>
          <span className="v2-strip-label" style={{ color: stripColor }}>{stripLabel}</span>
          {isPayment && <span className="v2-strip-arrow" style={{ color: stripColor }}>›</span>}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// VARIANT 3 — "Pill CTA" (mobile-inspired for desktop)
// ═════════════════════════════════════════════════════════════════════════════
function V3Card({ data, status }) {
  const isPayment = status === "make_payment";

  const pillStyle = isPayment
    ? { background:"var(--primary)", color:"white" }
    : { background:"var(--primary-mild)", color:"var(--primary-dark)" };
  const pillIcon  = isPayment ? <IcoWallet size={14}/> : <IcoWait size={14}/>;
  const pillLabel = isPayment ? "Make Payment" : "Waiting for a match";

  return (
    <div className="card-v3">
      <div className="v3-main">
        <div className="v3-left">
          <div className="v3-meta">
            <span className={`tag dir-${data.direction}`}>{data.direction.toUpperCase()}</span>
            <span className="v3-id">{data.id}</span>
            <span className="v3-date">· {data.date}</span>
          </div>
          <div className="v3-sats">
            <SatsAmount sats={data.sats}/>
          </div>
        </div>
        <div className="v3-right">
          <span className="v3-fiat">€{data.fiat}</span>
          <span className="v3-premium" style={{ color: isPayment ? "var(--error)" : "var(--success)" }}>
            +{data.premium}%
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:".68rem", color:"var(--black-65)" }}>
            <IcoClock size={10}/> {isPayment ? data.deadline : "23h 15m"}
          </span>
        </div>
      </div>
      <div className="v3-methods">
        {data.methods.map(m => <span key={m} className="tag tag-method">{m}</span>)}
        <span className="tag tag-currency">{data.currency}</span>
      </div>
      <button className="v3-pill" style={pillStyle}>
        {pillIcon} {pillLabel}
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function OfferCards() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="page">

        {/* ── CURRENT ── */}
        <div className="section-title">Current — Desktop (web)</div>
        <div className="cards-row">
          <div className="variant-group">
            <div className="variant-label">Waiting for buyer</div>
            <CurrentDesktopCard data={WAIT_FOR_BUYER} status="waiting_for_buyer"/>
          </div>
          <div className="variant-group">
            <div className="variant-label">Make payment</div>
            <CurrentDesktopCard data={MAKE_PAYMENT} status="make_payment"/>
          </div>
        </div>

        <div style={{ height: 28 }}/>
        <div className="section-title">Current — Mobile (app)</div>
        <div className="cards-row">
          <div className="variant-group">
            <div className="variant-label">Waiting for buyer</div>
            <CurrentMobileCard data={WAIT_FOR_BUYER} status="waiting_for_buyer"/>
          </div>
          <div className="variant-group">
            <div className="variant-label">Make payment</div>
            <CurrentMobileCard data={MAKE_PAYMENT} status="make_payment"/>
          </div>
        </div>

        <div className="divider"/>

        {/* ── VARIANT 1 ── */}
        <div className="section-title">Variant A — Structured</div>
        <p style={{ fontSize:".8rem", color:"var(--black-65)", marginBottom:20, maxWidth:560 }}>
          Clean two-zone layout. Info on top, status + action anchored to the bottom strip.
          Amounts and premium at a glance without visual noise.
        </p>
        <div className="cards-row">
          <div className="variant-group">
            <div className="variant-label">Waiting for buyer</div>
            <V1Card data={WAIT_FOR_BUYER} status="waiting_for_buyer"/>
          </div>
          <div className="variant-group">
            <div className="variant-label">Make payment</div>
            <V1Card data={MAKE_PAYMENT} status="make_payment"/>
          </div>
        </div>

        <div style={{ height: 40 }}/>

        {/* ── VARIANT 2 ── */}
        <div className="section-title">Variant B — Accent bar</div>
        <p style={{ fontSize:".8rem", color:"var(--black-65)", marginBottom:20, maxWidth:560 }}>
          Left accent bar + colored bottom strip communicate status at a glance before
          you read any text. Info density is high, useful when many trades are active.
        </p>
        <div className="cards-row">
          <div className="variant-group">
            <div className="variant-label">Waiting for buyer</div>
            <V2Card data={WAIT_FOR_BUYER} status="waiting_for_buyer"/>
          </div>
          <div className="variant-group">
            <div className="variant-label">Make payment</div>
            <V2Card data={MAKE_PAYMENT} status="make_payment"/>
          </div>
        </div>

        <div style={{ height: 40 }}/>

        {/* ── VARIANT 3 ── */}
        <div className="section-title">Variant C — Pill CTA (mobile-inspired)</div>
        <p style={{ fontSize:".8rem", color:"var(--black-65)", marginBottom:20, maxWidth:560 }}>
          Mirrors the mobile app structure — compact header info, payment methods as tags,
          full-width pill button that acts as both status indicator and tap target.
        </p>
        <div className="cards-row">
          <div className="variant-group">
            <div className="variant-label">Waiting for buyer</div>
            <V3Card data={WAIT_FOR_BUYER} status="waiting_for_buyer"/>
          </div>
          <div className="variant-group">
            <div className="variant-label">Make payment</div>
            <V3Card data={MAKE_PAYMENT} status="make_payment"/>
          </div>
        </div>

      </div>
    </>
  );
}
