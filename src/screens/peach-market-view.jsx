import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const PeachIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 352 353" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.38" width="352" height="352" rx="58.13" fill="#FFF9F6"/>
    <path d="M151.8 45.5c11.2-1.2 21.1 5.35 24.2 16.02.54 1.88.82 3.89.88 5.86.13 4.2.05 8.41.05 12.62 0 .39-.33.69-.72.7-3.07.11-6.08-.02-9.02-1-9.21-3.03-15.33-11.47-15.42-21.35-.04-4-.01-8.01 0-12.01" fill="#05A85A"/>
    <path d="M205.3 64.23c.99 8.75-5.26 16.21-13.69 16.46-4.77.14-9.15-3.93-7.14-8.26.95-2.06 2.42-3.88 4.47-5.44 2.3-1.76 4.93-2.69 7.82-2.74 2.83-.04 5.66 0 8.54 0" fill="#05A85A"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M276 155.69c0 49.73-43.64 96.87-97.47 96.87-19.52 0-37.71-6.2-52.95-16.48v49.48c0 12.29-9.96 22.26-22.26 22.26s-22.26-9.97-22.26-22.26V157.39h.02c-.01-.57-.02-1.13-.02-1.7 0-43.02 32.67-72.02 76.33-68.64 14.01 1.09 28.26 1.09 42.27 0 43.67-3.39 76.34 25.62 76.34 68.64zM125.61 163.8v-.39c.1-24.1 19.36-39.92 44.44-36.17 5.13.77 10.37.77 15.49 0 25.15-3.77 44.44 12.15 44.44 36.35 0 26.64-23.36 51.89-52.19 51.89-28.75 0-52.07-25.13-52.18-51.68z" fill="url(#pg)"/>
    <defs>
      <radialGradient id="pg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(276 88) rotate(159) scale(220 130)">
        <stop stopColor="#FFA24C"/>
        <stop offset=".5" stopColor="#FF7A50"/>
        <stop offset="1" stopColor="#FF4D42"/>
      </radialGradient>
    </defs>
  </svg>
);

// ─── SIDENAV ─────────────────────────────────────────────────────────────────
const IconMarket   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,14 7,9 11,12 18,5"/><polyline points="13,5 18,5 18,10"/></svg>;
const IconTrades   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 7h10M13 4l3 3-3 3"/><path d="M15 13H5M7 10l-3 3 3 3"/></svg>;
const IconCreate   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6.5" x2="10" y2="13.5"/><line x1="6.5" y1="10" x2="13.5" y2="10"/></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>;
const IconCreditCard = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="18" height="13" rx="2"/><line x1="1" y1="9" x2="19" y2="9"/><line x1="5" y1="14" x2="8" y2="14"/></svg>;

const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9,2 4,7 9,12"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5,2 10,7 5,12"/></svg>;
const IconBurger       = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="4.5" x2="16" y2="4.5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13.5" x2="16" y2="13.5"/></svg>;

const NAV_ITEMS = [
  { id:"home",     label:"Home",     icon:()=><PeachIcon size={20}/> },
  { id:"market",   label:"Market",   icon:()=><IconMarket/> },
  { id:"trades",   label:"Trades",   icon:()=><IconTrades/> },
  { id:"create",   label:"Create",   icon:()=><IconCreate/> },
  { id:"settings", label:"Settings", icon:()=><IconSettings/> },
  { id:"payment-methods", label:"Payments", icon:()=><IconCreditCard/> },
];

const NAV_ROUTES = { home:"/home", market:"/market", trades:"/trades", create:"/offer/new", settings:"/settings", "payment-methods":"/payment-methods" };

function SideNav({ active, collapsed, onToggle, mobileOpen, onClose, onNavigate }) {
  return (
    <>
      <div className={`sidenav-backdrop${mobileOpen?" open":""}`} onClick={onClose}/>
      <nav className={`sidenav${collapsed?" sidenav-collapsed":""}${mobileOpen?" sidenav-mobile-open":""}`}>
        <button className="sidenav-toggle" onClick={onToggle} title={collapsed?"Expand sidebar":"Collapse sidebar"}>
          {collapsed ? <IconChevronRight/> : <IconChevronLeft/>}
        </button>
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button key={id} className={`sidenav-item${active===id?" sidenav-active":""}`}
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
const MOCK_OFFERS = [
  { id:"a_me", type:"ask", amount:73000, premium:0.8, methods:["SEPA","Wise"], currencies:["EUR","CHF"], rep:4.7, trades:23, badges:["fast"], auto:false, online:true, isOwn:true },
  { id:"b_me", type:"bid", amount:[40000,120000], premium:-0.5, methods:["SEPA"], currencies:["EUR"], rep:4.7, trades:23, badges:["fast"], auto:false, online:true, isOwn:true },
  { id:"a1", type:"ask", amount:85000,          premium:-1.2, methods:["SEPA","Revolut"], currencies:["EUR","CHF"],       rep:4.9, trades:312, badges:["supertrader","fast"], auto:true,  online:true  },
  { id:"a2", type:"ask", amount:42000,          premium:0.5,  methods:["SEPA"],           currencies:["EUR"],             rep:4.7, trades:88,  badges:["fast"],              auto:false, online:true,  requested:true },
  { id:"a3", type:"ask", amount:250000,         premium:1.0,  methods:["SEPA","PayPal"],  currencies:["EUR","GBP"],       rep:5.0, trades:541, badges:["supertrader"],       auto:false, online:false },
  { id:"a4", type:"ask", amount:18000,          premium:2.1,  methods:["Revolut"],        currencies:["EUR"],             rep:4.3, trades:21,  badges:[],                    auto:false, online:true  },
  { id:"a5", type:"ask", amount:55000,          premium:-0.5, methods:["SEPA","Wise"],    currencies:["EUR","CHF"],       rep:4.8, trades:156, badges:["fast"],              auto:true,  online:true  },
  { id:"a6", type:"ask", amount:120000,         premium:1.8,  methods:["PayPal"],         currencies:["EUR"],             rep:4.6, trades:67,  badges:[],                    auto:false, online:true  },
  { id:"a7", type:"ask", amount:9000,           premium:3.2,  methods:["Revolut","SEPA"], currencies:["EUR","CHF","GBP"], rep:3.9, trades:9,   badges:[],                    auto:false, online:false },
  { id:"b1", type:"bid", amount:[30000,80000],  premium:-2.0, methods:["SEPA"],           currencies:["EUR"],             rep:4.5, trades:44,  badges:["fast"],              auto:true,  online:true  },
  { id:"b2", type:"bid", amount:[10000,30000],  premium:-0.8, methods:["SEPA","Revolut"], currencies:["EUR","CHF"],       rep:4.9, trades:201, badges:["supertrader"],       auto:false, online:true  },
  { id:"b3", type:"bid", amount:[50000,150000], premium:0.3,  methods:["PayPal"],         currencies:["EUR"],             rep:4.2, trades:33,  badges:[],                    auto:false, online:true  },
  { id:"b4", type:"bid", amount:[20000,60000],  premium:-1.5, methods:["Wise","SEPA"],    currencies:["EUR","GBP"],       rep:4.7, trades:119, badges:["fast"],              auto:false, online:false, requested:true },
  { id:"b5", type:"bid", amount:[100000,300000],premium:1.2,  methods:["SEPA"],           currencies:["EUR","CHF"],       rep:5.0, trades:489, badges:["supertrader","fast"],auto:true,  online:true  },
];

const BTC_PRICE      = 87432;
const ALL_CURRENCIES = ["EUR","CHF","GBP"];
const ALL_METHODS    = [...new Set(MOCK_OFFERS.flatMap(o => o.methods))].sort();

function satsToFiat(sats, price = BTC_PRICE) {
  return Math.round((sats / 100_000_000) * price).toLocaleString();
}
function formatSats(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(2)+"M";
  if (n >= 1_000)     return (n/1_000).toFixed(0)+"k";
  return n.toString();
}
function premiumStats(offers) {
  if (!offers.length) return { avg: null, best: null };
  const vals = offers.map(o => o.premium);
  const avg  = (vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(2);
  const min  = Math.min(...vals).toFixed(2);
  const max  = Math.max(...vals).toFixed(2);
  return { avg, min, max };
}
function fmtPct(v) {
  const n = parseFloat(v);
  return (n > 0 ? "+" : "") + n.toFixed(2) + "%";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --primary:#F56522;--primary-dark:#C45104;
    --primary-bg:#FFF9F6;--primary-mild:#FEEDE5;
    --grad:linear-gradient(90deg,#FF4D42,#FF7A50,#FFA24C);
    --success:#65A519;--success-bg:#F2F9E7;
    --error:#DF321F;--error-bg:#FFF0EE;
    --black:#2B1911;--black-75:#624D44;--black-65:#7D675E;
    --black-25:#C4B5AE;--black-10:#EAE3DF;--black-5:#F4EEEB;
    --surface:#FFFFFF;--font:'Baloo 2',cursive;--topbar:56px;
  }
  body{font-family:var(--font);background:var(--primary-bg);color:var(--black)}
  .app{display:flex;flex-direction:column;min-height:100vh}

  /* ── TOPBAR ── */
  .topbar{position:fixed;top:0;left:0;right:0;height:var(--topbar);background:var(--surface);
    border-bottom:1px solid var(--black-10);display:flex;align-items:center;
    padding:0 20px;gap:12px;z-index:200}
  .logo-wordmark{font-size:1.22rem;font-weight:800;letter-spacing:-0.02em;
    background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .topbar-price{display:flex;align-items:center;gap:10px;background:var(--primary-mild);
    border-radius:999px;padding:4px 14px;font-size:0.78rem;font-weight:600}
  .price-val{color:var(--black)}.price-label{color:var(--black-65);font-weight:500}.price-sep{color:var(--black-25)}
  .topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
  .updated-pill{font-size:0.7rem;color:var(--black-65);font-weight:500;display:flex;align-items:center;gap:5px}
  .updated-dot{width:6px;height:6px;border-radius:50%;background:var(--success);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  .avatar-peachid{display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 10px;border-radius:999px;transition:background .14s}
  .avatar-peachid:hover{background:var(--black-5)}
  .avatar{width:34px;height:34px;border-radius:50%;background:var(--grad);display:flex;
    align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:white;
    cursor:pointer;position:relative;flex-shrink:0}
  .avatar-badge{position:absolute;top:-3px;right:-3px;background:var(--error);color:white;
    font-size:.55rem;font-weight:800;width:14px;height:14px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;border:2px solid var(--surface)}
  .peach-id{font-size:.72rem;font-weight:800;letter-spacing:.06em;color:var(--black-75);font-family:var(--font);white-space:nowrap}

  /* ── SUBHEADER ── */
  .subheader{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    padding:12px 24px;background:var(--surface);border-bottom:1px solid var(--black-10);
    position:sticky;top:var(--topbar);z-index:100}

  /* ── TABS ── */
  .tabs{display:flex;gap:2px;background:var(--black-5);padding:3px;border-radius:10px}
  .tab{padding:6px 20px;border-radius:7px;font-size:.85rem;font-weight:700;cursor:pointer;
    border:none;background:transparent;color:var(--black-65);transition:all .14s;
    letter-spacing:.02em;font-family:var(--font)}
  .tab.active-buy{background:var(--surface);color:var(--success);box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .tab.active-sell{background:var(--surface);color:var(--error);box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .tab:hover:not(.active-buy):not(.active-sell){background:var(--black-10);color:var(--black)}

  /* ── STAT PILLS ── */
  .stat-pill{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;
    font-size:.76rem;font-weight:600;background:var(--black-5);color:var(--black-65);
    white-space:nowrap}
  .stat-pill strong{color:var(--black)}
  .stat-sep{color:var(--black-25);margin:0 2px}

  /* ── MULTI-SELECT DROPDOWN ── */
  .ms-wrap{position:relative}
  .ms-trigger{
    display:flex;align-items:center;gap:6px;
    border:1.5px solid var(--black-10);border-radius:8px;
    padding:5px 10px;font-family:var(--font);font-size:.8rem;font-weight:600;
    color:var(--black);background:var(--surface);cursor:pointer;
    transition:border-color .14s;white-space:nowrap;user-select:none;min-width:110px
  }
  .ms-trigger:hover,.ms-trigger.open{border-color:var(--primary)}
  .ms-trigger-label{flex:1}
  .ms-count{background:var(--primary);color:white;font-size:.62rem;font-weight:800;
    padding:1px 5px;border-radius:999px;line-height:1.4}
  .ms-arrow{font-size:.6rem;color:var(--black-65);transition:transform .14s}
  .ms-arrow.open{transform:rotate(180deg)}
  .ms-panel{
    position:absolute;top:calc(100% + 4px);left:0;z-index:300;
    background:var(--surface);border:1.5px solid var(--black-10);border-radius:10px;
    box-shadow:0 4px 20px rgba(43,25,17,.12);min-width:160px;overflow:hidden;
    animation:dropIn .12s ease
  }
  @keyframes dropIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
  .ms-option{
    display:flex;align-items:center;gap:9px;padding:8px 12px;
    font-size:.82rem;font-weight:600;cursor:pointer;
    transition:background .1s;color:var(--black)
  }
  .ms-option:hover{background:var(--black-5)}
  .ms-option.selected{color:var(--primary-dark)}
  .ms-checkbox{
    width:15px;height:15px;border-radius:4px;flex-shrink:0;
    border:1.5px solid var(--black-25);background:var(--surface);
    display:flex;align-items:center;justify-content:center;
    font-size:.65rem;font-weight:800;color:var(--primary-dark);
    transition:all .1s
  }
  .ms-checkbox.checked{background:var(--primary-mild);border-color:var(--primary)}
  .ms-clear{
    display:flex;align-items:center;justify-content:center;
    padding:6px 12px;font-size:.73rem;font-weight:700;color:var(--black-65);
    cursor:pointer;border-top:1px solid var(--black-5);
    transition:color .1s
  }
  .ms-clear:hover{color:var(--error)}

  /* ── REPUTATION DROPDOWN (single select, native-style) ── */
  .filter-select{appearance:none;border:1.5px solid var(--black-10);border-radius:8px;
    padding:5px 28px 5px 10px;font-family:var(--font);font-size:.8rem;font-weight:600;
    color:var(--black);background:var(--surface);cursor:pointer;outline:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237D675E'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 9px center;
    transition:border-color .14s}
  .filter-select:focus{border-color:var(--primary)}

  /* ── CTA ── */
  .cta-btn{margin-left:auto;padding:7px 20px;border-radius:999px;background:var(--grad);
    color:white;font-family:var(--font);font-size:.85rem;font-weight:800;border:none;
    cursor:pointer;letter-spacing:.02em;box-shadow:0 2px 12px rgba(245,101,34,.3);
    transition:transform .1s,box-shadow .1s;white-space:nowrap}
  .cta-btn:hover{transform:translateY(-1px);box-shadow:0 4px 18px rgba(245,101,34,.42)}

  /* ── TABLE ── */
  .table-wrap{padding:12px 20px 110px;flex:1;overflow-x:auto}
  .offer-table{width:100%;border-collapse:separate;border-spacing:0 5px;min-width:720px}
  .offer-table thead tr{border-bottom:none}
  .offer-table th{text-align:left;padding:4px 12px 8px;font-size:.67rem;font-weight:700;
    text-transform:uppercase;letter-spacing:.09em;color:var(--black-65);
    white-space:nowrap;cursor:pointer;user-select:none}
  .offer-table th:hover{color:var(--primary)}
  .th-sort{display:inline-flex;align-items:center;gap:4px}
  .sort-arrow{font-size:.58rem;opacity:.45}
  .sort-arrow.active{opacity:1;color:var(--primary)}
  .offer-table tbody tr{transition:box-shadow .1s}
  .offer-table tbody tr:hover td{background:var(--black-5)}
  .offer-table tbody tr:hover{box-shadow:0 2px 12px rgba(43,25,17,.09)}
  .offer-table td{
    padding:12px 12px;vertical-align:middle;font-size:.875rem;
    background:var(--surface);
    border-top:1px solid var(--black-10);border-bottom:1px solid var(--black-10);
  }
  .offer-table td:first-child{border-left:1px solid var(--black-10);border-radius:10px 0 0 10px}
  .offer-table td:last-child{border-right:1px solid var(--black-10);border-radius:0 10px 10px 0}

  /* ── REP ── */
  .rep-cell{display:flex;align-items:center;gap:8px}
  .rep-avatar{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:var(--grad);
    display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;color:white;
    position:relative}
  .rep-avatar .online-dot{position:absolute;bottom:0px;right:0px;width:9px;height:9px;
    border-radius:50%;background:var(--success);border:2px solid var(--surface)}
  .rep-info{display:flex;flex-direction:column;gap:2px}
  .rep-row{display:flex;align-items:center;gap:4px}
  .rep-stars{font-size:.78rem;font-weight:700;color:var(--black);display:flex;align-items:center;gap:2px}
  .rep-stars .star{color:#F7931A}
  .rep-trades{font-size:.67rem;color:var(--black-65);font-weight:500}
  .badges-row{display:flex;gap:3px;flex-wrap:wrap}
  .badge{display:inline-flex;align-items:center;padding:1px 6px;border-radius:999px;
    font-size:.62rem;font-weight:700;white-space:nowrap}
  .badge-super{background:linear-gradient(90deg,#FF4D42,#FFA24C);color:white}
  .badge-fast{background:var(--primary-mild);color:var(--primary-dark)}

  /* ── AUTO BADGE ── */
  .auto-badge{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;
    border-radius:999px;background:var(--grad);color:white;font-size:.68rem;font-weight:800;
    white-space:nowrap;box-shadow:0 1px 6px rgba(245,101,34,.28)}

  .offer-table tbody tr.own-row td{background:rgba(245,101,34,.05)}
  .offer-table tbody tr.own-row td:first-child{border-left:3px solid var(--primary)}
  .offer-table tbody tr.own-row:hover td{background:rgba(245,101,34,.09)}
  .own-label{font-size:.62rem;font-weight:800;color:var(--primary-dark);
    background:var(--primary-mild);border:1px solid rgba(245,101,34,.25);
    padding:1px 7px;border-radius:999px;white-space:nowrap;letter-spacing:.03em}
  /* mobile own card */
  .offer-card.own-card{border-left:3px solid var(--primary);background:linear-gradient(135deg,rgba(245,101,34,.04),var(--surface))}
  .my-offers-btn{padding:7px 16px;border-radius:999px;background:var(--surface);
    color:var(--black);font-family:var(--font);font-size:.85rem;font-weight:700;
    border:1.5px solid var(--black-10);cursor:pointer;letter-spacing:.02em;
    transition:border-color .14s,color .14s;white-space:nowrap}
  .my-offers-btn:hover{border-color:var(--primary);color:var(--primary-dark)}

  /* ── AMOUNT ── */
  .amount-cell{display:flex;flex-direction:column;gap:2px}
  .amount-sats{font-size:1rem;font-weight:800;color:var(--black)}
  .amount-fiat{font-size:.78rem;font-weight:500;color:var(--black-65)}

  /* ── PREMIUM — colors depend on perspective ── */
  /* buy tab: negative = good (green), positive = bad (red) */
  .prem-good{color:var(--success);font-weight:700}
  .prem-bad {color:var(--error);  font-weight:700}
  .prem-zero{color:var(--black-65);font-weight:600}

  /* ── METHODS ── */
  .methods{display:flex;gap:4px;flex-wrap:wrap}
  .method-chip{padding:2px 7px;border-radius:999px;font-size:.69rem;font-weight:600;
    background:var(--black-5);color:var(--black-65);border:1px solid var(--black-10)}

  /* ── CURRENCIES ── */
  .currencies{display:flex;gap:3px;flex-wrap:wrap}
  .currency-chip{padding:2px 7px;border-radius:4px;font-size:.69rem;font-weight:700;
    background:var(--primary-mild);color:var(--primary-dark);letter-spacing:.04em}

  /* ── ACTION ── */
  .action-cell{display:flex;align-items:center;gap:8px;justify-content:flex-end}
  .action-btn{padding:6px 18px;border-radius:999px;font-family:var(--font);font-size:.8rem;
    font-weight:800;border:none;cursor:pointer;letter-spacing:.02em;transition:all .12s;white-space:nowrap}
  .action-buy{background:var(--success-bg);color:var(--success)}
  .action-sell{background:var(--error-bg);color:var(--error)}
  .action-buy:hover{background:var(--success);color:white;transform:translateY(-1px)}
  .action-sell:hover{background:var(--error);color:white;transform:translateY(-1px)}
  .edit-btn{background:var(--primary-mild);color:var(--primary-dark)}
  .edit-btn:hover{background:var(--primary);color:white;transform:translateY(-1px)}

  /* ── EMPTY ── */
  .empty{text-align:center;padding:60px 20px;color:var(--black-65)}
  .empty-icon{font-size:2.2rem;margin-bottom:12px}
  .empty-title{font-size:1rem;font-weight:700;margin-bottom:6px;color:var(--black)}
  .empty-sub{font-size:.85rem}

  /* ── MOBILE CARDS ── */
  .cards{display:none;flex-direction:column;gap:10px;padding:14px 14px 110px}
  .offer-card{background:var(--surface);border-radius:14px;border:1px solid var(--black-10);
    padding:14px 16px;display:flex;flex-direction:column;gap:10px}
  .card-top{display:flex;align-items:flex-start;gap:10px}
  .offer-card .action-cell{margin-top:2px}
  .offer-card .amount-cell{align-items:flex-end}
  .offer-card .amount-sats{font-size:1.15rem}
  .offer-card .amount-fiat{font-size:.82rem}

  /* ── SIDENAV ── */
  .sidenav{
    position:fixed;top:var(--topbar);left:0;bottom:0;
    width:68px;background:var(--surface);border-right:1px solid var(--black-10);
    z-index:150;display:flex;flex-direction:column;align-items:center;
    padding:8px 0;gap:2px;
    transition:width .2s cubic-bezier(.4,0,.2,1);
    overflow:hidden;
  }
  .sidenav-collapsed{width:44px}
  .sidenav-toggle{
    width:100%;height:32px;display:flex;align-items:center;justify-content:flex-end;
    padding-right:10px;border:none;background:transparent;cursor:pointer;
    color:var(--black-25);flex-shrink:0;transition:color .14s;margin-bottom:4px;
  }
  .sidenav-toggle:hover{color:var(--black-65)}
  .sidenav-toggle svg{transition:transform .2s}
  .sidenav-item{
    width:calc(100% - 16px);display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:3px;padding:8px 4px;border-radius:10px;
    border:none;background:transparent;cursor:pointer;color:var(--black-65);
    font-family:var(--font);transition:all .14s;flex-shrink:0;
  }
  .sidenav-item:hover{background:var(--black-5);color:var(--black)}
  .sidenav-active{background:var(--primary-mild)!important;color:var(--primary-dark)!important}
  .sidenav-icon{display:flex;align-items:center;justify-content:center;height:22px;flex-shrink:0}
  .sidenav-label{
    font-size:.57rem;font-weight:700;letter-spacing:.02em;
    text-transform:uppercase;white-space:nowrap;overflow:hidden;
    transition:opacity .15s, max-height .2s;
    max-height:20px;opacity:1;
  }
  .sidenav-collapsed .sidenav-label{opacity:0;max-height:0;pointer-events:none}
  /* Backdrop (mobile overlay) */
  .sidenav-backdrop{
    display:none;position:fixed;inset:0;z-index:149;
    background:rgba(43,25,17,.4);
    animation:fadeIn .2s ease;
  }
  .sidenav-backdrop.open{display:block}
  /* Burger (mobile topbar) */
  .burger-btn{
    display:none;align-items:center;justify-content:center;
    width:34px;height:34px;border-radius:8px;border:none;
    background:transparent;cursor:pointer;color:var(--black-65);
    flex-shrink:0;transition:background .14s;
  }
  .burger-btn:hover{background:var(--black-5)}

  /* ── SEARCH ── */
  .search-inp{width:180px;border:1.5px solid var(--black-10);border-radius:8px;padding:5px 12px;font-family:var(--font);font-size:.8rem;font-weight:600;color:var(--black);background:var(--surface);outline:none;transition:border-color .14s}
  .search-inp:focus{border-color:var(--primary)}
  .search-inp::placeholder{color:var(--black-25);font-weight:500}

  /* ── CTA WRAP ── */
  .cta-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;margin-left:auto}
  .how-to-start{font-size:.67rem;font-weight:600;color:var(--primary);cursor:pointer;text-decoration:underline;text-underline-offset:2px;white-space:nowrap}
  .how-to-start:hover{color:var(--primary-dark)}

  /* ── REQUESTED ── */
  .requested-tag{font-size:.62rem;font-weight:800;color:#2D8048;background:#E6F5EA;border:1px solid #B6DEC1;padding:1px 7px;border-radius:999px;white-space:nowrap;letter-spacing:.03em}
  .offer-table tbody tr.requested-row td{background:rgba(101,165,25,.06)}
  .offer-table tbody tr.requested-row td:first-child{border-left:3px solid #65A519}
  .offer-table tbody tr.requested-row:hover td{background:rgba(101,165,25,.11)}
  .offer-card.requested-card{border-color:#B6DEC1;background:linear-gradient(135deg,rgba(101,165,25,.06),var(--surface))}

  @media(max-width:768px){
    .subheader{padding:10px 14px;gap:8px}
    .table-wrap{display:none}
    .cards{display:flex}
    .topbar-price{display:none}
    .cta-btn{padding:6px 14px;font-size:.78rem}
    .stat-pill.hide-mobile{display:none}
    .peach-id{display:none}
  }
  @media(max-width:480px){
    .sidenav{
      width:220px;left:0;
      transform:translateX(-100%);
      transition:transform .25s cubic-bezier(.4,0,.2,1);
      z-index:500;
      align-items:flex-start;
      box-shadow:none;
    }
    .sidenav-collapsed{width:220px}
    .sidenav.sidenav-mobile-open{
      transform:translateX(0);
      box-shadow:6px 0 28px rgba(43,25,17,.16);
    }
    .sidenav-item{
      width:calc(100% - 16px);flex-direction:row;justify-content:flex-start;
      gap:12px;padding:10px 14px;
    }
    .sidenav-collapsed .sidenav-item{width:calc(100% - 16px)}
    .sidenav-label,.sidenav-collapsed .sidenav-label{
      opacity:1!important;max-height:none!important;
      font-size:.8rem;text-transform:none;font-weight:600;letter-spacing:0;
    }
    .sidenav-toggle{display:none}
    .burger-btn{display:flex}
    .page-wrap{margin-left:0!important}
  }
`;

// ─── MULTI-SELECT DROPDOWN ────────────────────────────────────────────────────
function MultiSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(opt) {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  }

  const allSelected = value.length === 0;
  const displayLabel = allSelected
    ? label
    : value.length === 1
      ? value[0]
      : `${value[0]} +${value.length - 1}`;

  return (
    <div className="ms-wrap" ref={ref}>
      <div
        className={`ms-trigger${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="ms-trigger-label">{displayLabel}</span>
        {!allSelected && <span className="ms-count">{value.length}</span>}
        <span className={`ms-arrow${open ? " open" : ""}`}>▼</span>
      </div>
      {open && (
        <div className="ms-panel">
          {options.map(opt => {
            const checked = value.includes(opt);
            return (
              <div
                key={opt}
                className={`ms-option${checked ? " selected" : ""}`}
                onClick={() => toggle(opt)}
              >
                <div className={`ms-checkbox${checked ? " checked" : ""}`}>
                  {checked && "✓"}
                </div>
                {opt}
              </div>
            );
          })}
          {value.length > 0 && (
            <div className="ms-clear" onClick={() => { onChange([]); setOpen(false); }}>
              Clear selection
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
// isSellTab: when true, seller perspective → high premium is GOOD
function PremiumCell({ p, isSellTab }) {
  let cls;
  if (p === 0)       cls = "prem-zero";
  else if (isSellTab) cls = p > 0 ? "prem-good" : "prem-bad";
  else                cls = p < 0 ? "prem-good" : "prem-bad";
  return <span className={cls}>{p > 0 ? "+" : ""}{p.toFixed(2)}%</span>;
}

function RepCell({ offer }) {
  const initials = offer.id.toUpperCase().slice(0, 2);
  return (
    <div className="rep-cell">
      <div className="rep-avatar">
        {initials}
        {offer.online && <span className="online-dot"/>}
      </div>
      <div className="rep-info">
        <div className="rep-row">
          <span className="rep-stars"><span className="star">★</span>{offer.rep.toFixed(1)}</span>
          <span className="rep-trades">({offer.trades})</span>
        </div>
        {offer.badges.length > 0 && (
          <div className="badges-row">
            {offer.badges.includes("supertrader") && <span className="badge badge-super">🏆 Super</span>}
            {offer.badges.includes("fast")        && <span className="badge badge-fast">⚡ Fast</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function AmountCell({ offer }) {
  if (offer.type === "ask") {
    return (
      <div className="amount-cell">
        <span className="amount-sats">{formatSats(offer.amount)} sats</span>
        <span className="amount-fiat">≈ €{satsToFiat(offer.amount)}</span>
      </div>
    );
  }
  const [lo, hi] = offer.amount;
  return (
    <div className="amount-cell">
      <span className="amount-sats">{formatSats(lo)}–{formatSats(hi)} sats</span>
      <span className="amount-fiat">€{satsToFiat(lo)}–€{satsToFiat(hi)}</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function PeachMarket() {
  const navigate = useNavigate();
  const [tab,            setTab]            = useState("buy");
  const [sortKey,        setSortKey]        = useState("premium");
  const [sortDir,        setSortDir]        = useState(1);
  const [selCurrencies,    setSelCurrencies]    = useState([]);   // [] = all
  const [selMethods,       setSelMethods]       = useState([]);   // [] = all
  const [selPaymentTypes,  setSelPaymentTypes]  = useState([]);   // [] = all
  const [searchQuery,      setSearchQuery]      = useState("");
  const [filterMinRep,     setFilterMinRep]     = useState("0");
  const [myOffersOnly,   setMyOffersOnly]   = useState(false);
  const [secondsAgo,     setSecondsAgo]     = useState(0);
  const [btcPrice,       setBtcPrice]       = useState(BTC_PRICE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const isSellTab = tab === "sell";

  useEffect(() => {
    const iv = setInterval(() => {
      setSecondsAgo(s => {
        if (s >= 15) { setBtcPrice(p => p + Math.round((Math.random()-0.5)*90)); return 0; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const offerType = isSellTab ? "bid" : "ask";

  const PAYMENT_TYPE_MAP = {
    "Cash":      ["Cash"],
    "Online":    ["SEPA","Revolut","Wise","PayPal"],
    "Gift card": ["Amazon","iTunes"],
  };

  const filtered = MOCK_OFFERS
    .filter(o => o.type === offerType)
    .filter(o => !myOffersOnly || o.isOwn)
    .filter(o => selCurrencies.length === 0 || selCurrencies.some(c => o.currencies.includes(c)))
    .filter(o => selMethods.length === 0    || selMethods.some(m => o.methods.includes(m)))
    .filter(o => selPaymentTypes.length === 0 || selPaymentTypes.some(pt =>
      (PAYMENT_TYPE_MAP[pt] || []).some(m => o.methods.includes(m))
    ))
    .filter(o => o.rep >= parseFloat(filterMinRep))
    .filter(o => searchQuery.trim() === "" ||
      o.methods.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.currencies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "premium") return (a.premium - b.premium) * sortDir;
      if (sortKey === "amount") {
        const aV = Array.isArray(a.amount) ? a.amount[0] : a.amount;
        const bV = Array.isArray(b.amount) ? b.amount[0] : b.amount;
        return (aV - bV) * sortDir;
      }
      if (sortKey === "rep") return (b.rep - a.rep) * sortDir;
      return 0;
    });

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d * -1);
    else { setSortKey(key); setSortDir(1); }
  }

  function SortTh({ col, label }) {
    const active = sortKey === col;
    return (
      <th onClick={() => toggleSort(col)}>
        <span className="th-sort">
          {label}
          <span className={`sort-arrow${active ? " active" : ""}`}>
            {active ? (sortDir === 1 ? "▲" : "▼") : "⇅"}
          </span>
        </span>
      </th>
    );
  }

  const stats = premiumStats(filtered);
  const satsPerEur  = Math.round(100_000_000 / btcPrice);
  const updatedText = secondsAgo === 0 ? "Just now" : `${secondsAgo}s ago`;

  // For stat pill: avg color follows the same perspective logic
  function statColor(val) {
    const n = parseFloat(val);
    if (n === 0) return "var(--black)";
    return isSellTab
      ? (n > 0 ? "var(--success)" : "var(--error)")
      : (n < 0 ? "var(--success)" : "var(--error)");
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* ── TOP BAR ── */}
        <header className="topbar">
          <button className="burger-btn" onClick={() => setSidebarMobileOpen(o => !o)}><IconBurger/></button>
          <PeachIcon size={28} />
          <span className="logo-wordmark">Peach</span>
          <div className="topbar-price">
            <span className="price-label">BTC/EUR</span>
            <span className="price-val">€{btcPrice.toLocaleString()}</span>
            <span className="price-sep">·</span>
            <span className="price-label">sats/€</span>
            <span className="price-val">{satsPerEur.toLocaleString()}</span>
          </div>
          <div className="topbar-right">
            <div className="updated-pill">
              <span className="updated-dot"/>
              {updatedText}
            </div>
            <div className="avatar-peachid">
              <span className="peach-id">PEACH08476D23</span>
              <div className="avatar">PW<div className="avatar-badge">2</div></div>
            </div>
          </div>
        </header>

        <SideNav
          active="market"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          mobileOpen={sidebarMobileOpen}
          onClose={() => setSidebarMobileOpen(false)}
          onNavigate={navigate}
        />

        <div className="page-wrap" style={{ marginTop:"var(--topbar)", marginLeft: sidebarCollapsed ? 44 : 68, display:"flex", flexDirection:"column", flex:1 }}>

          {/* ── SUBHEADER ── */}
          <div className="subheader">
            {/* Tabs */}
            <div className="tabs">
              <button className={`tab${!isSellTab ? " active-buy"  : ""}`} onClick={()=>setTab("buy") }>Buy BTC</button>
              <button className={`tab${ isSellTab ? " active-sell" : ""}`} onClick={()=>setTab("sell")}>Sell BTC</button>
            </div>

            {/* Stats */}
            {stats.avg !== null && (
              <div className="stat-pill">
                <span>{filtered.length} offers</span>
                <span className="stat-sep">·</span>
                <span>Avg <strong style={{color:statColor(stats.avg)}}>{fmtPct(stats.avg)}</strong></span>
                <span className="stat-sep">·</span>
                {isSellTab ? (
                  <span>Best <strong style={{color:"var(--success)"}}>{fmtPct(stats.max)}</strong></span>
                ) : (
                  <span>Best <strong style={{color:"var(--success)"}}>{fmtPct(stats.min)}</strong></span>
                )}
              </div>
            )}

            {/* Filters */}
            <MultiSelect
              label="Payment type"
              options={["Cash","Online","Gift card"]}
              value={selPaymentTypes}
              onChange={setSelPaymentTypes}
            />
            <MultiSelect
              label="Currency"
              options={ALL_CURRENCIES}
              value={selCurrencies}
              onChange={setSelCurrencies}
            />
            <MultiSelect
              label="Payment method"
              options={ALL_METHODS}
              value={selMethods}
              onChange={setSelMethods}
            />
            <select
              className="filter-select"
              value={filterMinRep}
              onChange={e=>setFilterMinRep(e.target.value)}
            >
              <option value="0">Any rep</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>

            <input
              className="search-inp"
              placeholder="Search offers…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <button
              className="my-offers-btn"
              onClick={() => setMyOffersOnly(o => !o)}
              style={myOffersOnly ? {borderColor:"var(--primary)",color:"var(--primary-dark)",background:"var(--primary-mild)"} : {}}
            >
              My Offers{myOffersOnly ? " ✕" : ""}
            </button>
            <div className="cta-wrap">
              <button className="cta-btn" onClick={() => navigate("/offer/new")}>+ Create Offer</button>
              <span className="how-to-start">How to start</span>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🍑</div>
                <div className="empty-title">No offers match your filters</div>
                <div className="empty-sub">Try adjusting the currency, payment method, or reputation filter</div>
              </div>
            ) : (
              <table className="offer-table">
                <thead>
                  <tr>
                    <SortTh col="rep"     label="Reputation" />
                    <SortTh col="amount"  label="Amount" />
                    <SortTh col="premium" label="Premium" />
                    <th>Payment</th>
                    <th>Currencies</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(offer => (
                    <tr key={offer.id} className={[offer.isOwn?"own-row":"", offer.requested&&!offer.auto?"requested-row":""].filter(Boolean).join(" ")}
                      style={{cursor:"pointer"}} onClick={() => navigate(`/trade/${offer.id}`)}>
                      <td><RepCell offer={offer}/></td>
                      <td><AmountCell offer={offer}/></td>
                      <td><PremiumCell p={offer.premium} isSellTab={isSellTab}/></td>
                      <td>
                        <div className="methods">
                          {offer.methods.map(m=><span key={m} className="method-chip">{m}</span>)}
                        </div>
                      </td>
                      <td>
                        <div className="currencies">
                          {offer.currencies.map(c=><span key={c} className="currency-chip">{c}</span>)}
                        </div>
                      </td>
                      <td>
                        <div className="action-cell">
                          {offer.isOwn && <span className="own-label">Your offer</span>}
                          {offer.auto && <span className="auto-badge">⚡ Instant Match</span>}
                          {offer.isOwn
                            ? <button className="action-btn edit-btn">✏ Edit</button>
                            : offer.requested && !offer.auto
                              ? <span className="requested-tag">Requested</span>
                              : <button className={`action-btn action-${tab}`}>{isSellTab ? "Sell" : "Buy"}</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── MOBILE CARDS ── */}
          <div className="cards">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🍑</div>
                <div className="empty-title">No offers found</div>
                <div className="empty-sub">Adjust your filters</div>
              </div>
            ) : filtered.map(offer => (
            <div key={offer.id} className={`offer-card${offer.isOwn?" own-card":""}${offer.requested&&!offer.auto?" requested-card":""}`}
              style={{cursor:"pointer"}} onClick={() => navigate(`/trade/${offer.id}`)}>
                {/* Row 1: avatar · rep/badges (left) | action buttons (right) */}
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className="rep-avatar" style={{flexShrink:0}}>
                    {offer.id.toUpperCase().slice(0,2)}
                    {offer.online && <span className="online-dot"/>}
                  </div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                    <span className="rep-stars"><span className="star">★</span>{offer.rep.toFixed(1)}</span>
                    <span className="rep-trades">({offer.trades})</span>
                    {offer.isOwn && <span className="own-label">Your offer</span>}
                    {offer.badges.includes("supertrader")&&<span className="badge badge-super">🏆</span>}
                    {offer.badges.includes("fast")&&<span className="badge badge-fast">⚡</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    {offer.auto&&<span className="auto-badge">⚡ Instant Match</span>}
                    {offer.isOwn
                      ? <button className="action-btn edit-btn">✏ Edit</button>
                      : offer.requested && !offer.auto
                        ? <span className="requested-tag">Requested</span>
                        : <button className={`action-btn action-${tab}`}>{isSellTab?"Sell":"Buy"}</button>
                    }
                  </div>
                </div>
                {/* Row 2: amount right-aligned */}
                <div style={{textAlign:"right"}}>
                  <AmountCell offer={offer}/>
                </div>
                {/* Row 3: tags (left) · premium (right) */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {offer.methods.map(m=><span key={m} className="method-chip">{m}</span>)}
                    {offer.currencies.map(c=><span key={c} className="currency-chip">{c}</span>)}
                  </div>
                  <PremiumCell p={offer.premium} isSellTab={isSellTab}/>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
