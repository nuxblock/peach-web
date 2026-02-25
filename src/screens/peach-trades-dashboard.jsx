import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const PeachIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 352 353" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.38" width="352" height="352" rx="58.13" fill="#FFF9F6"/>
    <path d="M151.8 45.5c11.2-1.2 21.1 5.35 24.2 16.02.54 1.88.82 3.89.88 5.86.13 4.2.05 8.41.05 12.62 0 .39-.33.69-.72.7-3.07.11-6.08-.02-9.02-1-9.21-3.03-15.33-11.47-15.42-21.35-.04-4-.01-8.01 0-12.01" fill="#05A85A"/>
    <path d="M205.3 64.23c.99 8.75-5.26 16.21-13.69 16.46-4.77.14-9.15-3.93-7.14-8.26.95-2.06 2.42-3.88 4.47-5.44 2.3-1.76 4.93-2.69 7.82-2.74 2.83-.04 5.66 0 8.54 0" fill="#05A85A"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M276 155.69c0 49.73-43.64 96.87-97.47 96.87-19.52 0-37.71-6.2-52.95-16.48v49.48c0 12.29-9.96 22.26-22.26 22.26s-22.26-9.97-22.26-22.26V157.39h.02c-.01-.57-.02-1.13-.02-1.7 0-43.02 32.67-72.02 76.33-68.64 14.01 1.09 28.26 1.09 42.27 0 43.67-3.39 76.34 25.62 76.34 68.64zM125.61 163.8v-.39c.1-24.1 19.36-39.92 44.44-36.17 5.13.77 10.37.77 15.49 0 25.15-3.77 44.44 12.15 44.44 36.35 0 26.64-23.36 51.89-52.19 51.89-28.75 0-52.07-25.13-52.18-51.68z" fill="url(#pg_td)"/>
    <defs>
      <radialGradient id="pg_td" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(276 88) rotate(159) scale(220 130)">
        <stop stopColor="#FFA24C"/><stop offset=".5" stopColor="#FF7A50"/><stop offset="1" stopColor="#FF4D42"/>
      </radialGradient>
    </defs>
  </svg>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconMarket   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,14 7,9 11,12 18,5"/><polyline points="13,5 18,5 18,10"/></svg>;
const IconTrades   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 7h10M13 4l3 3-3 3"/><path d="M15 13H5M7 10l-3 3 3 3"/></svg>;
const IconCreate   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6.5" x2="10" y2="13.5"/><line x1="6.5" y1="10" x2="13.5" y2="10"/></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>;
const IconNews     = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="16" height="13" rx="2"/><line x1="6" y1="8" x2="14" y2="8"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="14" x2="10" y2="14"/></svg>;
const IconChevLeft  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9,2 4,7 9,12"/></svg>;
const IconChevRight = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5,2 10,7 5,12"/></svg>;
const IconBurger    = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="4.5" x2="16" y2="4.5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13.5" x2="16" y2="13.5"/></svg>;
const IconSort      = ({ dir }) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={dir === "asc" ? "M2 8l4-5 4 5" : dir === "desc" ? "M2 4l4 5 4-5" : "M2 4.5l4-3 4 3M2 7.5l4 3 4-3"}/></svg>;
const IconChevDown  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3,5 7,9 11,5"/></svg>;
const IconMsg       = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-3 2V10H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>;
const IconClock     = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="5"/><path d="M6.5 3.5v3l2 1.5"/></svg>;
const IconAlert     = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 2L1 12h12L7 2z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="11" r=".5" fill="currentColor"/></svg>;
const IconEmpty     = () => <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#C4B5AE" strokeWidth="1.5" strokeLinecap="round"><rect x="8" y="12" width="32" height="28" rx="4"/><path d="M16 12V9a8 8 0 0 1 16 0v3"/><line x1="19" y1="24" x2="29" y2="24"/><line x1="19" y1="30" x2="25" y2="30"/></svg>;

const NAV_ITEMS = [
  { id:"home",     label:"Home",     icon:()=><PeachIcon size={20}/> },
  { id:"market",   label:"Market",   icon:()=><IconMarket/> },
  { id:"trades",   label:"Trades",   icon:()=><IconTrades/> },
  { id:"create",   label:"Create",   icon:()=><IconCreate/> },
  { id:"settings", label:"Settings", icon:()=><IconSettings/> },
  { id:"news",     label:"News",     icon:()=><IconNews/> },
];

const NAV_ROUTES = { home:"/home", market:"/market", trades:"/trades", create:"/offer/new", settings:"/settings" };

function SideNav({ active, collapsed, onToggle, mobileOpen, onClose, onNavigate }) {
  return (
    <>
      <div className={`sidenav-backdrop${mobileOpen ? " open" : ""}`} onClick={onClose}/>
      <nav className={`sidenav${collapsed ? " sidenav-collapsed" : ""}${mobileOpen ? " sidenav-mobile-open" : ""}`}>
        <button className="sidenav-toggle" onClick={onToggle}>{collapsed ? <IconChevRight/> : <IconChevLeft/>}</button>
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button key={id} className={`sidenav-item${active === id ? " sidenav-active" : ""}`}
            onClick={() => { if (onNavigate && NAV_ROUTES[id]) onNavigate(NAV_ROUTES[id]); }}>
            <span className="sidenav-icon">{icon()}</span>
            <span className="sidenav-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const BTC_PRICE = 87432;
const SAT = 100_000_000;

function satsToFiat(sats, price = BTC_PRICE) {
  return ((sats / SAT) * price).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

// Status config: label, chip color, text color, whether action is required
const STATUS_CONFIG = {
  open_offer:          { label: "Open Offer",          bg: "#F4EEEB", color: "#7D675E", action: false },
  pending_match:       { label: "Pending Match",       bg: "#D7F2FE", color: "#037DB5", action: false },
  matched:             { label: "Matched",             bg: "#FEFCE5", color: "#9A7000", action: true  },
  escrow_funded:       { label: "Escrow Funded",       bg: "#FEFCE5", color: "#9A7000", action: true  },
  payment_in_transit:  { label: "Payment Sent",        bg: "#FEEDE5", color: "#C45104", action: false },
  awaiting_payment:    { label: "Awaiting Payment",    bg: "#FEEDE5", color: "#C45104", action: true  },
  payment_confirmed:   { label: "Payment Confirmed",   bg: "#F2F9E7", color: "#65A519", action: true  },
  dispute:             { label: "Dispute",             bg: "#FFE6E1", color: "#DF321F", action: true  },
  cancellation_pending:{ label: "Cancellation Req.",  bg: "#FFE6E1", color: "#DF321F", action: true  },
  completed:           { label: "Completed",           bg: "#F2F9E7", color: "#65A519", action: false },
  cancelled:           { label: "Cancelled",           bg: "#F4EEEB", color: "#7D675E", action: false },
};

// Mock avatars by initials + color
const AVATARS = ["KL","MR","ST","DV","NB","FR","PW","JC","EH","OT"];
const AVATAR_COLORS = ["#FF7A50","#037DB5","#65A519","#F56522","#9B5CFF","#DF321F","#F5CE22","#05A85A"];

// Active trades mock
const MOCK_ACTIVE = [
  // Open offers (user's own, unmatched)
  {
    id:"oo1", kind:"open_offer", direction:"sell",
    amount:73000, premium:0.8, methods:["SEPA","Wise"], currencies:["EUR","CHF"],
    createdAt: Date.now() - 2 * 3600_000, expiresIn: "22h",
    counterparty: null, unread: 0,
  },
  {
    id:"oo2", kind:"open_offer", direction:"buy",
    amount:[40000,120000], premium:-0.5, methods:["SEPA"], currencies:["EUR"],
    createdAt: Date.now() - 45 * 60_000, expiresIn: "23h 15m",
    counterparty: null, unread: 0,
  },
  // Pending matches (user matched, waiting on seller)
  {
    id:"pm1", kind:"pending_match", direction:"buy",
    amount:85000, premium:-1.2, methods:["SEPA","Revolut"], currencies:["EUR"],
    matchedAt: Date.now() - 12 * 60_000,
    counterparty: { initials:"KL", color:"#FF7A50", name:"Peer #4E2A", rep:4.9, trades:312, badges:["supertrader"] },
    unread: 0,
  },
  {
    id:"pm2", kind:"pending_match", direction:"buy",
    amount:42000, premium:0.5, methods:["SEPA"], currencies:["EUR"],
    matchedAt: Date.now() - 3 * 60_000,
    counterparty: { initials:"MR", color:"#037DB5", name:"Peer #7F1C", rep:4.7, trades:88, badges:["fast"] },
    unread: 0,
  },
  // Active contracts
  {
    id:"ct1", kind:"contract", status:"awaiting_payment", direction:"buy",
    amount:85000, premium:-1.2, methods:["SEPA"], currencies:["EUR"],
    startedAt: Date.now() - 4 * 3600_000, deadline: Date.now() + 8 * 3600_000,
    counterparty: { initials:"ST", color:"#65A519", name:"Peer #2B90", rep:5.0, trades:541, badges:["supertrader"] },
    unread: 3,
    fiatAmount: "74.32",
  },
  {
    id:"ct2", kind:"contract", status:"payment_in_transit", direction:"sell",
    amount:120000, premium:1.8, methods:["PayPal"], currencies:["EUR"],
    startedAt: Date.now() - 1.5 * 3600_000,
    counterparty: { initials:"DV", color:"#F56522", name:"Peer #A1F3", rep:4.6, trades:67, badges:[] },
    unread: 1,
    fiatAmount: "102.18",
  },
  {
    id:"ct3", kind:"contract", status:"payment_confirmed", direction:"sell",
    amount:55000, premium:-0.5, methods:["SEPA"], currencies:["EUR"],
    startedAt: Date.now() - 6 * 3600_000,
    counterparty: { initials:"NB", color:"#9B5CFF", name:"Peer #C73E", rep:4.8, trades:156, badges:["fast"] },
    unread: 0,
    fiatAmount: "47.88",
  },
  {
    id:"ct4", kind:"contract", status:"dispute", direction:"buy",
    amount:30000, premium:-2.0, methods:["Revolut"], currencies:["EUR"],
    startedAt: Date.now() - 28 * 3600_000,
    counterparty: { initials:"FR", color:"#DF321F", name:"Peer #D8B1", rep:3.9, trades:9, badges:[] },
    unread: 5,
    fiatAmount: "26.23",
  },
];

// Trade history mock
const MOCK_HISTORY = [
  {
    id:"h1", direction:"buy", status:"completed",
    amount:100000, fiatAmount:"87.43", currency:"EUR", premium:-1.5,
    method:"SEPA",
    counterparty:{ initials:"PW", color:"#FF7A50", name:"Peer #4E2A", rep:4.9 },
    completedAt: new Date(Date.now() - 2 * 86400_000),
    ratingGiven: 5,
    tradeId:"CT-00142",
  },
  {
    id:"h2", direction:"sell", status:"completed",
    amount:50000, fiatAmount:"44.21", currency:"EUR", premium:0.8,
    method:"Revolut",
    counterparty:{ initials:"JC", color:"#037DB5", name:"Peer #F2E0", rep:4.7 },
    completedAt: new Date(Date.now() - 5 * 86400_000),
    ratingGiven: 5,
    tradeId:"CT-00138",
  },
  {
    id:"h3", direction:"buy", status:"cancelled",
    amount:75000, fiatAmount:"65.57", currency:"EUR", premium:-0.5,
    method:"SEPA",
    counterparty:{ initials:"EH", color:"#65A519", name:"Peer #91CA", rep:4.2 },
    completedAt: new Date(Date.now() - 8 * 86400_000),
    ratingGiven: null,
    tradeId:"CT-00131",
  },
  {
    id:"h4", direction:"sell", status:"completed",
    amount:200000, fiatAmount:"174.86", currency:"EUR", premium:1.2,
    method:"Wise",
    counterparty:{ initials:"OT", color:"#9B5CFF", name:"Peer #55D3", rep:5.0 },
    completedAt: new Date(Date.now() - 14 * 86400_000),
    ratingGiven: 5,
    tradeId:"CT-00122",
  },
  {
    id:"h5", direction:"buy", status:"completed",
    amount:45000, fiatAmount:"39.34", currency:"CHF", premium:-2.1,
    method:"SEPA",
    counterparty:{ initials:"KL", color:"#F56522", name:"Peer #7B2F", rep:4.8 },
    completedAt: new Date(Date.now() - 21 * 86400_000),
    ratingGiven: 1,
    tradeId:"CT-00115",
  },
  {
    id:"h6", direction:"sell", status:"completed",
    amount:350000, fiatAmount:"306.01", currency:"EUR", premium:0.3,
    method:"SEPA",
    counterparty:{ initials:"MR", color:"#05A85A", name:"Peer #CC88", rep:4.9 },
    completedAt: new Date(Date.now() - 30 * 86400_000),
    ratingGiven: 5,
    tradeId:"CT-00108",
  },
];

const ALL_METHODS = ["SEPA","Revolut","Wise","PayPal","Strike"];
const ALL_CURRENCIES = ["EUR","CHF","GBP"];
const ALL_STATUSES = Object.keys(STATUS_CONFIG).filter(s => !["completed","cancelled"].includes(s));

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function formatDate(date) {
  return date.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

// ─── DROPDOWN FILTER ─────────────────────────────────────────────────────────
function FilterDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const count = selected.length;
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        className={`filter-dropdown-btn${open ? " open" : ""}${count > 0 ? " active" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        {count > 0 && <span className="filter-count">{count}</span>}
        <IconChevDown/>
      </button>
      {open && (
        <div className="filter-panel">
          {options.map(opt => (
            <label key={opt} className="filter-option">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])}
              />
              <span>{opt}</span>
            </label>
          ))}
          {count > 0 && (
            <button className="filter-clear" onClick={() => { onChange([]); setOpen(false); }}>
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── STATUS CHIP ─────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open_offer;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:cfg.bg, color:cfg.color,
      borderRadius:999, padding:"2px 10px",
      fontSize:".72rem", fontWeight:700, whiteSpace:"nowrap",
    }}>
      {cfg.action && <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.color, display:"inline-block" }}/>}
      {cfg.label}
    </span>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 36, online }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background: color || "var(--grad)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: size * 0.36, fontWeight:700, color:"white",
        flexShrink:0,
      }}>{initials}</div>
      {online && (
        <div style={{
          position:"absolute", bottom:0, right:0,
          width:9, height:9, borderRadius:"50%",
          background:"#65A519", border:"2px solid white",
        }}/>
      )}
    </div>
  );
}

// ─── TRADE CARD (Active) ──────────────────────────────────────────────────────
function TradeCard({ trade, onSelect }) {
  const cfg = STATUS_CONFIG[trade.kind === "contract" ? trade.status : trade.kind] || {};
  const needsAction = cfg.action;
  const isBuy = trade.direction === "buy";

  function renderAmount() {
    if (Array.isArray(trade.amount)) {
      return `${fmt(trade.amount[0])}–${fmt(trade.amount[1])} sats`;
    }
    return `${fmt(trade.amount)} sats`;
  }
  function renderFiat() {
    if (Array.isArray(trade.amount)) {
      return `≈ €${satsToFiat(trade.amount[0])}–€${satsToFiat(trade.amount[1])}`;
    }
    return `≈ €${satsToFiat(trade.amount)}`;
  }

  function renderActions() {
    const s = trade.status;
    const b = (label, color, bg, hc) => (
      <button className="card-action-btn" style={{ background:bg, color:color }}
        onMouseEnter={e => { e.target.style.background = hc; e.target.style.color = "white"; }}
        onMouseLeave={e => { e.target.style.background = bg; e.target.style.color = color; }}
      >{label}</button>
    );
    if (trade.kind === "open_offer")    return <>{b("Edit Offer","#C45104","#FEEDE5","#F56522")}{b("Withdraw","#DF321F","#FFF0EE","#DF321F")}</>;
    if (trade.kind === "pending_match") return <>{b("View Offer","#037DB5","#D7F2FE","#037DB5")}{b("Unmatch","#7D675E","#F4EEEB","#7D675E")}</>;
    if (s === "awaiting_payment")       return b("I've Paid","#65A519","#F2F9E7","#65A519");
    if (s === "payment_in_transit")     return b("Confirm Payment","#65A519","#F2F9E7","#65A519");
    if (s === "payment_confirmed")      return b("Release Bitcoin","#F56522","#FEEDE5","#F56522");
    if (s === "dispute")                return b("View Dispute","#DF321F","#FFF0EE","#DF321F");
    if (s === "cancellation_pending")   return <>{b("Accept","#65A519","#F2F9E7","#65A519")}{b("Reject","#DF321F","#FFF0EE","#DF321F")}</>;
    return b("View Trade","#C45104","#FEEDE5","#F56522");
  }

  function renderTimeInfo() {
    if (trade.kind === "open_offer")    return <span><IconClock/> Expires in {trade.expiresIn}</span>;
    if (trade.kind === "pending_match") return <span><IconClock/> Matched {relativeTime(trade.matchedAt)}</span>;
    if (trade.deadline) {
      const left = trade.deadline - Date.now();
      const h = Math.floor(left / 3600_000);
      const m = Math.floor((left % 3600_000) / 60_000);
      const urgent = h < 2;
      return <span style={{ color: urgent ? "#DF321F" : undefined }}><IconClock/> {h}h {m}m remaining</span>;
    }
    return <span><IconClock/> {relativeTime(trade.startedAt)}</span>;
  }

  return (
    <div className={`trade-card${needsAction ? " trade-card-urgent" : ""}`}
      style={{cursor:"pointer"}} onClick={() => onSelect && onSelect(trade.id)}>
      {/* Card header */}
      <div className="card-header">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span className={`direction-badge direction-${isBuy ? "buy" : "sell"}`}>
            {isBuy ? "BUY" : "SELL"}
          </span>
          <StatusChip status={trade.kind === "contract" ? trade.status : trade.kind}/>
        </div>
        {trade.unread > 0 && (
          <div className="unread-badge">
            <IconMsg/>
            <span>{trade.unread}</span>
          </div>
        )}
      </div>

      {/* Counterparty or offer info */}
      <div className="card-body">
        {trade.counterparty ? (
          <div className="card-counterparty">
            <Avatar initials={trade.counterparty.initials} color={trade.counterparty.color} size={38} online/>
            <div>
              <div style={{ fontWeight:700, fontSize:".88rem" }}>{trade.counterparty.name}</div>
              <div style={{ fontSize:".75rem", color:"var(--black-65)", display:"flex", gap:6, alignItems:"center" }}>
                <span>{"★".repeat(Math.round(trade.counterparty.rep))}{"☆".repeat(5-Math.round(trade.counterparty.rep))}</span>
                <span>{trade.counterparty.rep.toFixed(1)}</span>
                <span>·</span>
                <span>{trade.counterparty.trades} trades</span>
                {trade.counterparty.badges?.includes("supertrader") && <span style={{ background:"linear-gradient(90deg,#FF4D42,#FFA24C)", color:"white", borderRadius:999, padding:"1px 7px", fontSize:".68rem", fontWeight:700 }}>🏆 Supertrader</span>}
                {trade.counterparty.badges?.includes("fast") && <span style={{ background:"#FEEDE5", color:"#C45104", borderRadius:999, padding:"1px 7px", fontSize:".68rem", fontWeight:700 }}>⚡ Fast</span>}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize:".8rem", color:"var(--black-65)", fontStyle:"italic" }}>
            Waiting for a match…
          </div>
        )}

        {/* Amount */}
        <div className="card-amount">
          <span className="amount-sats">{renderAmount()}</span>
          <span className="amount-fiat">{renderFiat()}</span>
          {trade.premium !== undefined && (
            <span style={{
              fontSize:".72rem", fontWeight:700,
              color: isBuy
                ? (trade.premium < 0 ? "var(--success)" : "var(--error)")
                : (trade.premium > 0 ? "var(--success)" : "var(--error)"),
            }}>
              {trade.premium > 0 ? "+" : ""}{trade.premium.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Methods + currencies */}
        <div className="card-tags">
          {(trade.methods || []).map(m => (
            <span key={m} className="tag tag-method">{m}</span>
          ))}
          {(trade.currencies || []).map(c => (
            <span key={c} className="tag tag-currency">{c}</span>
          ))}
        </div>

        {/* Fiat amount if contract */}
        {trade.fiatAmount && (
          <div style={{ fontSize:".78rem", color:"var(--black-65)", marginTop:2 }}>
            Fiat: <strong style={{ color:"var(--black)" }}>€{trade.fiatAmount}</strong>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="card-footer">
        <div className="card-time">{renderTimeInfo()}</div>
        <div className="card-actions">{renderActions()}</div>
      </div>
    </div>
  );
}

// ─── HISTORY TABLE ────────────────────────────────────────────────────────────
function HistoryTable({ rows }) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("completedAt");
  const [sortDir, setSortDir] = useState(-1);
  const [histSearch, setHistSearch] = useState("");

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  }

  const sorted = [...rows]
    .filter(r => {
      if (!histSearch.trim()) return true;
      const q = histSearch.toLowerCase();
      return r.tradeId.toLowerCase().includes(q) ||
        r.counterparty.name.toLowerCase().includes(q) ||
        r.method.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortKey === "completedAt") return (a.completedAt - b.completedAt) * sortDir;
      if (sortKey === "amount")      return (a.amount - b.amount) * sortDir;
      if (sortKey === "fiatAmount")  return (parseFloat(a.fiatAmount) - parseFloat(b.fiatAmount)) * sortDir;
      if (sortKey === "premium")     return (a.premium - b.premium) * sortDir;
      return 0;
    });

  function Th({ col, label, align = "left" }) {
    const active = sortKey === col;
    const dir = active ? (sortDir === 1 ? "asc" : "desc") : null;
    return (
      <th onClick={() => toggleSort(col)} style={{ cursor:"pointer", textAlign:align }}>
        <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
          {label} <IconSort dir={dir}/>
        </span>
      </th>
    );
  }

  if (!rows.length) {
    return (
      <div className="empty-state">
        <IconEmpty/>
        <p>No trade history yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <input
          className="hist-search"
          placeholder="Search by ID, counterparty, method…"
          value={histSearch}
          onChange={e => setHistSearch(e.target.value)}
        />
      </div>
      <div className="hist-table-wrap">
        <table className="hist-table">
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Type</th>
              <th>Counterparty</th>
              <Th col="amount" label="Amount (sats)"/>
              <Th col="fiatAmount" label="Fiat"/>
              <Th col="premium" label="Premium" align="right"/>
              <th>Method</th>
              <th>Status</th>
              <th>Rating</th>
              <Th col="completedAt" label="Date"/>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.id} className="hist-row" style={{cursor:"pointer"}} onClick={() => navigate(`/trade/${r.id}`)}>
                <td><span style={{ fontFamily:"monospace", fontSize:".78rem", color:"var(--black-65)" }}>{r.tradeId}</span></td>
                <td>
                  <span className={`direction-badge direction-${r.direction}`}>{r.direction.toUpperCase()}</span>
                </td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Avatar initials={r.counterparty.initials} color={r.counterparty.color} size={26}/>
                    <span style={{ fontSize:".83rem" }}>{r.counterparty.name}</span>
                  </div>
                </td>
                <td style={{ fontWeight:600 }}>{fmt(r.amount)} <span style={{ fontWeight:400, color:"var(--black-65)", fontSize:".75rem" }}>sats</span></td>
                <td style={{ fontWeight:600 }}>{r.currency === "CHF" ? "₣" : "€"}{r.fiatAmount}</td>
                <td style={{ textAlign:"right" }}>
                  <span style={{
                    fontWeight:700, fontSize:".82rem",
                    color: r.direction === "buy"
                      ? (r.premium < 0 ? "var(--success)" : "var(--error)")
                      : (r.premium > 0 ? "var(--success)" : "var(--error)"),
                  }}>
                    {r.premium > 0 ? "+" : ""}{r.premium.toFixed(2)}%
                  </span>
                </td>
                <td><span className="tag tag-method">{r.method}</span></td>
                <td><StatusChip status={r.status}/></td>
                <td>
                  {r.ratingGiven !== null
                    ? <span style={{ fontSize:"1rem" }}>{r.ratingGiven === 5 ? "👍" : "👎"}</span>
                    : <span style={{ color:"var(--black-25)", fontSize:".78rem" }}>—</span>
                  }
                </td>
                <td style={{ color:"var(--black-65)", fontSize:".82rem", whiteSpace:"nowrap" }}>{formatDate(r.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:12, fontSize:".78rem", color:"var(--black-65)" }}>
        {sorted.length} trade{sorted.length !== 1 ? "s" : ""}
        {histSearch && ` matching "${histSearch}"`}
      </div>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --primary:#F56522;--primary-dark:#C45104;--primary-mild:#FEEDE5;
    --grad:linear-gradient(90deg,#FF4D42,#FF7A50,#FFA24C);
    --success:#65A519;--success-bg:#F2F9E7;
    --error:#DF321F;--error-bg:#FFF0EE;
    --black:#2B1911;--black-75:#624D44;--black-65:#7D675E;
    --black-25:#C4B5AE;--black-10:#EAE3DF;--black-5:#F4EEEB;
    --surface:#FFFFFF;--bg:#FFF9F6;--font:'Baloo 2',cursive;--topbar:56px;
  }
  body{font-family:var(--font);background:var(--bg);color:var(--black)}

  /* Topbar */
  .topbar{position:fixed;top:0;left:0;right:0;height:var(--topbar);background:var(--surface);
    border-bottom:1px solid var(--black-10);display:flex;align-items:center;
    padding:0 20px;gap:12px;z-index:200}
  .logo-wordmark{font-size:1.22rem;font-weight:800;letter-spacing:-.02em;
    background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .topbar-price{display:flex;align-items:center;gap:6px;background:var(--primary-mild);
    border-radius:999px;padding:4px 14px;font-size:.78rem;font-weight:600;margin-left:4px}
  .price-label{color:var(--black-65)}
  .price-val{color:var(--black)}
  .price-sep{color:var(--black-25)}
  .topbar-right{margin-left:auto;display:flex;align-items:center;gap:12px}
  .updated-pill{display:flex;align-items:center;gap:5px;font-size:.73rem;font-weight:600;color:var(--black-65);
    background:var(--black-5);border-radius:999px;padding:3px 10px}
  .updated-dot{width:6px;height:6px;border-radius:50%;background:#65A519;flex-shrink:0}
  .avatar-peachid{display:flex;align-items:center;gap:8px}
  .peach-id{font-size:.68rem;font-weight:600;color:var(--black-65);font-family:monospace;
    background:var(--black-5);border-radius:999px;padding:3px 10px;display:none}
  @media(min-width:900px){.peach-id{display:block}}
  .avatar{width:34px;height:34px;border-radius:50%;background:var(--grad);color:white;
    font-size:.8rem;font-weight:700;display:flex;align-items:center;justify-content:center;
    position:relative;cursor:pointer;flex-shrink:0}
  .avatar-badge{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;
    background:var(--error);color:white;font-size:.6rem;font-weight:800;
    display:flex;align-items:center;justify-content:center;border:2px solid white}
  .burger-btn{display:none;align-items:center;justify-content:center;
    width:34px;height:34px;border-radius:8px;border:none;
    background:transparent;cursor:pointer;color:var(--black-65);
    flex-shrink:0;transition:background .14s}
  .burger-btn:hover{background:var(--black-5)}
  @media(max-width:480px){.burger-btn{display:flex}}

  /* Sidenav */
  .sidenav{
    position:fixed;top:var(--topbar);left:0;bottom:0;
    width:68px;background:var(--surface);border-right:1px solid var(--black-10);
    z-index:150;display:flex;flex-direction:column;align-items:center;
    padding:8px 0;gap:2px;
    transition:width .2s cubic-bezier(.4,0,.2,1);overflow:hidden}
  .sidenav-collapsed{width:44px}
  .sidenav-toggle{
    width:100%;height:32px;display:flex;align-items:center;justify-content:flex-end;
    padding-right:10px;border:none;background:transparent;cursor:pointer;
    color:var(--black-25);flex-shrink:0;transition:color .14s;margin-bottom:4px}
  .sidenav-toggle:hover{color:var(--black-65)}
  .sidenav-item{
    width:calc(100% - 16px);display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:3px;padding:8px 4px;border-radius:10px;
    border:none;background:transparent;cursor:pointer;color:var(--black-65);
    font-family:var(--font);transition:all .14s;flex-shrink:0}
  .sidenav-item:hover{background:var(--black-5);color:var(--black)}
  .sidenav-active{background:var(--primary-mild)!important;color:var(--primary-dark)!important}
  .sidenav-icon{display:flex;align-items:center;justify-content:center;height:22px;flex-shrink:0}
  .sidenav-label{
    font-size:.57rem;font-weight:700;letter-spacing:.02em;
    text-transform:uppercase;white-space:nowrap;overflow:hidden;
    transition:opacity .15s,max-height .2s;max-height:20px;opacity:1}
  .sidenav-collapsed .sidenav-label{opacity:0;max-height:0;pointer-events:none}
  .sidenav-backdrop{display:none;position:fixed;inset:0;z-index:149;
    background:rgba(43,25,17,.4);animation:fadeIn .2s ease}
  .sidenav-backdrop.open{display:block}
  @media(max-width:480px){
    .sidenav{transform:translateX(-100%);width:220px;transition:transform .2s}
    .sidenav-mobile-open{transform:translateX(0)}
    .sidenav-backdrop.open{display:block}
    .sidenav-label{opacity:1;max-height:20px}
    .sidenav-item{flex-direction:row;justify-content:flex-start;padding:10px 16px;gap:12px}
  }

  /* Page layout */
  .page-wrap{margin-top:var(--topbar);margin-left:68px;padding:32px 28px;min-height:calc(100vh - 56px)}
  @media(max-width:480px){.page-wrap{margin-left:0;padding:20px 16px}}

  /* Page header */
  .page-header{display:flex;align-items:flex-start;gap:16px;margin-bottom:28px;flex-wrap:wrap}
  .page-title{font-size:1.5rem;font-weight:800;letter-spacing:-.02em}
  .page-subtitle{font-size:.85rem;color:var(--black-65);margin-top:2px}
  .header-right{margin-left:auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}

  /* Daily limit bar */
  .limit-bar-wrap{background:var(--surface);border:1px solid var(--black-10);border-radius:12px;
    padding:12px 16px;min-width:220px}
  .limit-bar-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
  .limit-bar-label{font-size:.72rem;font-weight:700;color:var(--black-65);text-transform:uppercase;letter-spacing:.05em}
  .limit-bar-val{font-size:.78rem;font-weight:700}
  .limit-bar-track{height:6px;background:var(--black-10);border-radius:3px;overflow:hidden}
  .limit-bar-fill{height:100%;background:var(--grad);border-radius:3px;transition:width .3s}

  /* CTA button */
  .btn-cta{background:var(--grad);color:white;border:none;border-radius:999px;
    font-family:var(--font);font-size:.85rem;font-weight:800;
    padding:8px 20px;cursor:pointer;white-space:nowrap;
    box-shadow:0 2px 12px rgba(245,101,34,.3);transition:transform .15s,box-shadow .15s}
  .btn-cta:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(245,101,34,.4)}

  /* Main tabs */
  .main-tabs{display:flex;gap:4px;background:var(--black-5);border-radius:12px;padding:4px;
    margin-bottom:24px;width:fit-content}
  .main-tab{background:none;border:none;cursor:pointer;font-family:var(--font);
    font-size:.88rem;font-weight:600;color:var(--black-65);
    padding:7px 20px;border-radius:9px;transition:background .15s,color .15s}
  .main-tab:hover{color:var(--black)}
  .main-tab.active{background:var(--surface);color:var(--black);font-weight:700;
    box-shadow:0 1px 4px rgba(0,0,0,.08)}

  /* Sub-tabs (Buy/Sell) */
  .sub-tabs{display:flex;gap:8px;margin-bottom:16px;align-items:center}
  .sub-tab{background:none;border:1.5px solid var(--black-10);cursor:pointer;font-family:var(--font);
    font-size:.82rem;font-weight:700;color:var(--black-65);
    padding:5px 18px;border-radius:999px;transition:all .15s}
  .sub-tab:hover{border-color:var(--primary);color:var(--primary-dark)}
  .sub-tab.active.buy{background:#F2F9E7;border-color:#65A519;color:#65A519}
  .sub-tab.active.sell{background:#FFF0EE;border-color:#DF321F;color:#DF321F}
  .sub-tab-count{background:currentColor;color:white;border-radius:999px;
    padding:0 6px;font-size:.65rem;font-weight:800;margin-left:4px;opacity:.85}

  /* Filter row */
  .filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;align-items:center}
  .filter-label{font-size:.72rem;font-weight:700;color:var(--black-65);text-transform:uppercase;letter-spacing:.05em}

  /* Filter dropdown */
  .filter-dropdown-btn{
    display:flex;align-items:center;gap:6px;
    background:var(--surface);border:1.5px solid var(--black-10);border-radius:999px;
    font-family:var(--font);font-size:.8rem;font-weight:600;color:var(--black-75);
    padding:5px 12px 5px 14px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap}
  .filter-dropdown-btn:hover,.filter-dropdown-btn.open{border-color:var(--primary);color:var(--primary-dark)}
  .filter-dropdown-btn.active{background:var(--primary-mild);border-color:var(--primary);color:var(--primary-dark)}
  .filter-count{background:var(--primary);color:white;border-radius:999px;
    padding:0 6px;font-size:.65rem;font-weight:800}
  .filter-panel{position:absolute;top:calc(100% + 6px);left:0;min-width:160px;
    background:var(--surface);border:1px solid var(--black-10);border-radius:12px;
    padding:8px;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:100}
  .filter-option{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;
    cursor:pointer;font-size:.83rem;font-weight:500;color:var(--black-75);transition:background .1s}
  .filter-option:hover{background:var(--black-5)}
  .filter-option input{accent-color:var(--primary);cursor:pointer}
  .filter-clear{width:100%;background:none;border:none;border-top:1px solid var(--black-10);
    margin-top:6px;padding:6px 8px 2px;font-family:var(--font);font-size:.75rem;font-weight:700;
    color:var(--error);cursor:pointer;text-align:left}

  /* Cards grid */
  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
  @media(max-width:640px){.cards-grid{grid-template-columns:1fr}}

  /* Trade card */
  .trade-card{
    background:var(--surface);border:1px solid var(--black-10);border-radius:16px;
    overflow:hidden;transition:box-shadow .15s,transform .1s;display:flex;flex-direction:column;
    cursor:pointer;
  }
  .trade-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.09);transform:translateY(-1px)}
  .trade-card-urgent{border-left:3px solid var(--primary)}
  .card-header{display:flex;align-items:center;justify-content:space-between;
    padding:12px 16px 0;gap:8px}
  .card-body{padding:12px 16px;flex:1;display:flex;flex-direction:column;gap:10px}
  .card-footer{padding:10px 16px 14px;display:flex;align-items:center;
    justify-content:space-between;gap:8px;border-top:1px solid var(--black-5);flex-wrap:wrap}
  .card-time{display:flex;align-items:center;gap:5px;font-size:.75rem;color:var(--black-65);font-weight:500}
  .card-actions{display:flex;gap:6px;flex-wrap:wrap}
  .card-action-btn{
    border:none;border-radius:999px;font-family:var(--font);
    font-size:.75rem;font-weight:700;padding:5px 12px;cursor:pointer;transition:all .15s}
  .card-counterparty{display:flex;align-items:center;gap:10px}
  .card-amount{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}
  .amount-sats{font-size:.95rem;font-weight:800;color:var(--black)}
  .amount-fiat{font-size:.78rem;color:var(--black-65);font-weight:500}
  .card-tags{display:flex;gap:5px;flex-wrap:wrap}
  .unread-badge{display:flex;align-items:center;gap:4px;
    background:var(--error-bg);color:var(--error);
    border-radius:999px;padding:3px 8px;font-size:.72rem;font-weight:700}

  /* Direction badge */
  .direction-badge{display:inline-flex;align-items:center;border-radius:999px;
    padding:2px 10px;font-size:.7rem;font-weight:800;letter-spacing:.04em}
  .direction-buy{background:#F2F9E7;color:#65A519}
  .direction-sell{background:#FFF0EE;color:#DF321F}

  /* Tags */
  .tag{display:inline-flex;align-items:center;border-radius:999px;
    padding:2px 8px;font-size:.7rem;font-weight:600;white-space:nowrap}
  .tag-method{background:var(--black-5);color:var(--black-75)}
  .tag-currency{background:var(--primary-mild);color:var(--primary-dark)}

  /* Empty state */
  .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:12px;padding:64px 24px;color:var(--black-65);text-align:center}
  .empty-state p{font-size:.9rem}
  .empty-actions{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center}

  /* History table */
  .hist-search{
    width:100%;max-width:360px;
    background:var(--surface);border:1.5px solid var(--black-10);border-radius:999px;
    font-family:var(--font);font-size:.83rem;color:var(--black);
    padding:7px 16px;outline:none;transition:border-color .15s}
  .hist-search:focus{border-color:var(--primary)}
  .hist-table-wrap{overflow-x:auto;border:1px solid var(--black-10);border-radius:14px}
  .hist-table{width:100%;border-collapse:collapse;font-size:.83rem}
  .hist-table thead tr{background:var(--primary-mild)}
  .hist-table th{
    text-align:left;padding:10px 14px;
    font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
    color:var(--primary-dark);border-bottom:2px solid var(--black-10);white-space:nowrap;
    user-select:none}
  .hist-table th:hover{color:var(--primary)}
  .hist-table td{padding:11px 14px;border-bottom:1px solid var(--black-5);vertical-align:middle}
  .hist-row:last-child td{border-bottom:none}
  .hist-row:hover td{background:var(--black-5)}

  /* Urgent alert banner */
  .urgent-banner{
    background:linear-gradient(90deg,#FFF0EE,#FFF9F6);
    border:1px solid rgba(245,101,34,.25);border-radius:12px;
    padding:10px 16px;margin-bottom:20px;
    display:flex;align-items:center;gap:10px;font-size:.83rem;color:var(--primary-dark);font-weight:600}
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TradesDashboard() {
  const navigate = useNavigate();
  const [mainTab, setMainTab]     = useState("active");   // "active" | "history"
  const [subTab, setSubTab]       = useState("buy");      // "buy" | "sell"
  const [filterMethods, setFilterMethods]     = useState([]);
  const [filterCurrencies, setFilterCurrencies] = useState([]);
  const [filterStatuses, setFilterStatuses]   = useState([]);

  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [btcPrice, setBtcPrice]         = useState(BTC_PRICE);
  const [secondsAgo, setSecondsAgo]     = useState(0);

  // BTC price tick
  useEffect(() => {
    const iv = setInterval(() => {
      setSecondsAgo(s => {
        if (s >= 15) { setBtcPrice(p => p + Math.round((Math.random() - .5) * 90)); return 0; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const satsPerEur  = Math.round(SAT / btcPrice);
  const updatedText = secondsAgo === 0 ? "Just now" : `${secondsAgo}s ago`;

  // Daily limit mock: 340 EUR used out of 1000 EUR
  const LIMIT_TOTAL = 1000;
  const LIMIT_USED  = 340;
  const limitPct = Math.min(100, (LIMIT_USED / LIMIT_TOTAL) * 100);

  // Filter active trades
  const filtered = MOCK_ACTIVE.filter(t => {
    if (t.direction !== subTab) return false;

    if (filterMethods.length > 0) {
      const methods = t.methods || [];
      if (!filterMethods.some(m => methods.includes(m))) return false;
    }
    if (filterCurrencies.length > 0) {
      const currencies = t.currencies || [];
      if (!filterCurrencies.some(c => currencies.includes(c))) return false;
    }
    if (filterStatuses.length > 0) {
      const s = t.kind === "contract" ? t.status : t.kind;
      if (!filterStatuses.includes(s)) return false;
    }
    return true;
  });

  // Sort: action-required first, then by time
  const sortedFiltered = [...filtered].sort((a, b) => {
    const aAction = (STATUS_CONFIG[a.kind === "contract" ? a.status : a.kind] || {}).action ? 1 : 0;
    const bAction = (STATUS_CONFIG[b.kind === "contract" ? b.status : b.kind] || {}).action ? 1 : 0;
    if (aAction !== bAction) return bAction - aAction;
    return 0;
  });

  // Count urgent items
  const urgentCount = MOCK_ACTIVE.filter(t => {
    const cfg = STATUS_CONFIG[t.kind === "contract" ? t.status : t.kind] || {};
    return cfg.action;
  }).length;

  // Count by sub-tab
  const buyCount  = MOCK_ACTIVE.filter(t => t.direction === "buy").length;
  const sellCount = MOCK_ACTIVE.filter(t => t.direction === "sell").length;

  const anyFilterActive = filterMethods.length + filterCurrencies.length + filterStatuses.length > 0;

  function clearAllFilters() {
    setFilterMethods([]);
    setFilterCurrencies([]);
    setFilterStatuses([]);
  }

  return (
    <>
      <style>{CSS}</style>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <button className="burger-btn" onClick={() => setMobileOpen(o => !o)}><IconBurger/></button>
        <PeachIcon size={28}/>
        <span className="logo-wordmark">Peach</span>
        <div className="topbar-price">
          <span className="price-label">BTC/EUR</span>
          <span className="price-val">€{btcPrice.toLocaleString()}</span>
          <span className="price-sep">·</span>
          <span className="price-label">sats/€</span>
          <span className="price-val">{satsPerEur.toLocaleString()}</span>
        </div>
        <div className="topbar-right">
          <div className="updated-pill"><span className="updated-dot"/>{updatedText}</div>
          <div className="avatar-peachid">
            <span className="peach-id">PEACH08476D23</span>
            <div className="avatar">PW<div className="avatar-badge">2</div></div>
          </div>
        </div>
      </header>

      <SideNav
        active="trades"
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={navigate}
      />

      {/* ── PAGE ── */}
      <main className="page-wrap">
        {/* Page header */}
        <div className="page-header">
          <div>
            <div className="page-title">Your Trades</div>
            <div className="page-subtitle">Manage your active trades and review history</div>
          </div>
          <div className="header-right">
            <div className="limit-bar-wrap">
              <div className="limit-bar-top">
                <span className="limit-bar-label">Daily Limit</span>
                <span className="limit-bar-val">€{LIMIT_USED} <span style={{ fontWeight:400, color:"var(--black-65)" }}>/ €{LIMIT_TOTAL}</span></span>
              </div>
              <div className="limit-bar-track">
                <div className="limit-bar-fill" style={{ width:`${limitPct}%` }}/>
              </div>
            </div>
            <button className="btn-cta">+ New Offer</button>
          </div>
        </div>

        {/* Urgent action banner */}
        {urgentCount > 0 && (
          <div className="urgent-banner">
            <IconAlert/>
            <span>{urgentCount} trade{urgentCount > 1 ? "s" : ""} require{urgentCount === 1 ? "s" : ""} your attention</span>
          </div>
        )}

        {/* Main tabs */}
        <div className="main-tabs">
          <button className={`main-tab${mainTab === "active" ? " active" : ""}`} onClick={() => setMainTab("active")}>
            Active Trades {MOCK_ACTIVE.length > 0 && <span style={{ background:"var(--primary)", color:"white", borderRadius:999, padding:"0 7px", fontSize:".7rem", fontWeight:800, marginLeft:6 }}>{MOCK_ACTIVE.length}</span>}
          </button>
          <button className={`main-tab${mainTab === "history" ? " active" : ""}`} onClick={() => setMainTab("history")}>
            Trade History
          </button>
        </div>

        {/* ── ACTIVE TRADES ── */}
        {mainTab === "active" && (
          <>
            {/* Buy / Sell sub-tabs */}
            <div className="sub-tabs">
              <button className={`sub-tab buy${subTab === "buy" ? " active" : ""}`} onClick={() => setSubTab("buy")}>
                Buy
                <span className="sub-tab-count">{buyCount}</span>
              </button>
              <button className={`sub-tab sell${subTab === "sell" ? " active" : ""}`} onClick={() => setSubTab("sell")}>
                Sell
                <span className="sub-tab-count">{sellCount}</span>
              </button>
            </div>

            {/* Filter row */}
            <div className="filter-row">
              <span className="filter-label">Filter</span>
              <FilterDropdown
                label="Payment Method"
                options={ALL_METHODS}
                selected={filterMethods}
                onChange={setFilterMethods}
              />
              <FilterDropdown
                label="Currency"
                options={ALL_CURRENCIES}
                selected={filterCurrencies}
                onChange={setFilterCurrencies}
              />
              <FilterDropdown
                label="Status"
                options={ALL_STATUSES}
                selected={filterStatuses}
                onChange={v => setFilterStatuses(v)}
              />
              {anyFilterActive && (
                <button onClick={clearAllFilters} style={{
                  background:"none", border:"none", cursor:"pointer",
                  font:"inherit", fontSize:".78rem", fontWeight:700,
                  color:"var(--black-65)", padding:"4px 8px", borderRadius:999,
                  transition:"color .15s",
                }} onMouseEnter={e => e.target.style.color="var(--error)"}
                   onMouseLeave={e => e.target.style.color="var(--black-65)"}>
                  Clear all ✕
                </button>
              )}
            </div>

            {/* Cards */}
            {sortedFiltered.length === 0 ? (
              <div className="empty-state">
                <IconEmpty/>
                <p>{anyFilterActive ? "No trades match the selected filters." : `No ${subTab} trades yet.`}</p>
                <div className="empty-actions">
                  {anyFilterActive
                    ? <button className="btn-cta" onClick={clearAllFilters}>Clear Filters</button>
                    : <button className="btn-cta">Browse Market</button>
                  }
                </div>
              </div>
            ) : (
              <div className="cards-grid">
                {sortedFiltered.map(t => <TradeCard key={t.id} trade={t} onSelect={(id) => navigate(`/trade/${id}`)}/>)}
              </div>
            )}
          </>
        )}

        {/* ── TRADE HISTORY ── */}
        {mainTab === "history" && (
          <HistoryTable rows={MOCK_HISTORY}/>
        )}
      </main>
    </>
  );
}
