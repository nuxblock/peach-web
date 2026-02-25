import { useState, useEffect } from "react";
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

// ─── NAV ICONS ────────────────────────────────────────────────────────────────
const IconMarket   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,14 7,9 11,12 18,5"/><polyline points="13,5 18,5 18,10"/></svg>;
const IconTrades   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 7h10M13 4l3 3-3 3"/><path d="M15 13H5M7 10l-3 3 3 3"/></svg>;
const IconCreate   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6.5" x2="10" y2="13.5"/><line x1="6.5" y1="10" x2="13.5" y2="10"/></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>;
const IconNews     = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="16" height="13" rx="2"/><line x1="6" y1="8" x2="14" y2="8"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="14" x2="10" y2="14"/></svg>;
const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9,2 4,7 9,12"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="5,2 10,7 5,12"/></svg>;
const IconBurger       = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="4.5" x2="16" y2="4.5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13.5" x2="16" y2="13.5"/></svg>;

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
      <div className={`sidenav-backdrop${mobileOpen?" open":""}`} onClick={onClose}/>
      <nav className={`sidenav${collapsed?" sidenav-collapsed":""}${mobileOpen?" sidenav-mobile-open":""}`}>
        <button className="sidenav-toggle" onClick={onToggle} title={collapsed?"Expand":"Collapse"}>
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

// ─── TOGGLE COMPONENT ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 26, borderRadius: 999, border: "none",
        background: checked ? "#F56522" : "#C4B5AE",
        cursor: "pointer", position: "relative",
        transition: "background .2s", flexShrink: 0,
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: checked ? 21 : 3,
        width: 20, height: 20, borderRadius: "50%",
        background: "#FFFFFF",
        boxShadow: "0 1px 4px rgba(0,0,0,.2)",
        transition: "left .2s",
        display: "block",
      }}/>
    </button>
  );
}

// ─── SETTINGS ROW ─────────────────────────────────────────────────────────────
function SettingsRow({ label, description, icon, right, warning, onClick, noBorder }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 20px",
        borderBottom: noBorder ? "none" : "1px solid #F4EEEB",
        cursor: onClick ? "pointer" : "default",
        transition: "background .12s",
        borderRadius: noBorder ? "0 0 12px 12px" : 0,
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = "#FFF9F6"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "#F4EEEB", display: "flex",
          alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: "1rem",
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: ".9rem", fontWeight: 600,
          color: warning ? "#DF321F" : "#2B1911",
          lineHeight: 1.3,
        }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: ".75rem", color: "#7D675E", marginTop: 2, fontWeight: 400 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {right}
        {warning && (
          <span style={{ fontSize: "1.1rem" }}>⚠️</span>
        )}
        {onClick && !right && (
          <span style={{ color: "#C4B5AE" }}><IconChevronRight/></span>
        )}
        {onClick && right && (
          <span style={{ color: "#C4B5AE" }}><IconChevronRight/></span>
        )}
      </div>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: ".72rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: ".1em",
        color: "#F56522", marginBottom: 8, paddingLeft: 4,
      }}>
        {title}
      </div>
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #EAE3DF",
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {children}
      </div>
    </div>
  );
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
  .sidenav-backdrop{
    display:none;position:fixed;inset:0;z-index:149;
    background:rgba(43,25,17,.4);
    animation:fadeIn .2s ease;
  }
  .sidenav-backdrop.open{display:block}
  .burger-btn{
    display:none;align-items:center;justify-content:center;
    width:34px;height:34px;border-radius:8px;border:none;
    background:transparent;cursor:pointer;color:var(--black-65);
    flex-shrink:0;transition:background .14s;
  }
  .burger-btn:hover{background:var(--black-5)}

  /* ── SETTINGS PAGE ── */
  .settings-scroll{
    margin-top:var(--topbar);
    padding: 32px 24px 80px;
    max-width: 640px;
  }
  .settings-page-title{
    font-size:1.5rem;font-weight:800;color:var(--black);
    margin-bottom:28px;letter-spacing:-0.02em;
  }

  /* ── VERSION FOOTER ── */
  .version-footer{
    text-align:center;padding:20px 0 8px;
    font-size:.72rem;color:var(--black-25);font-weight:500;
  }

  @media(max-width:768px){
    .topbar-price{display:none}
    .peach-id{display:none}
    .settings-scroll{padding:24px 16px 80px}
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const btcPrice = 87432;

  // Toggleable settings state
  const [diagnostics, setDiagnostics] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifTrades, setNotifTrades] = useState(true);
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setSecondsAgo(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const satsPerEur = Math.round(100_000_000 / btcPrice);
  const updatedText = secondsAgo === 0 ? "Just now" : `${secondsAgo}s ago`;

  const sideMargin = sidebarCollapsed ? 44 : 68;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <button className="burger-btn" onClick={() => setSidebarMobileOpen(o => !o)}><IconBurger/></button>
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
          active="settings"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          mobileOpen={sidebarMobileOpen}
          onClose={() => setSidebarMobileOpen(false)}
          onNavigate={navigate}
        />

        {/* ── SETTINGS CONTENT ── */}
        <div
          className="page-wrap"
          style={{ marginLeft: sideMargin }}
        >
          <div className="settings-scroll">
            <h1 className="settings-page-title">Settings</h1>

            {/* ── ACCOUNT ── */}
            <SettingsSection title="Account">
              <SettingsRow
                icon="👤"
                label="My Profile"
                description="Reputation, badges, and trading history"
                onClick={() => {}}
              />
              <SettingsRow
                icon="🎁"
                label="Referrals"
                description="Invite friends and earn rewards"
                onClick={() => {}}
              />
              <SettingsRow
                icon="🔐"
                label="Backups"
                description="Back up your account to avoid losing access"
                warning={true}
                onClick={() => {}}
                noBorder
              />
            </SettingsSection>

            {/* ── TRADING & BITCOIN ── */}
            <SettingsSection title="Trading & Bitcoin">
              <SettingsRow
                icon="💳"
                label="Payment Methods"
                description="Add or manage your accepted payment methods"
                onClick={() => {}}
              />
              <SettingsRow
                icon="⛏️"
                label="Network Fees"
                description="Set your preferred on-chain fee rate"
                onClick={() => {}}
              />
              <SettingsRow
                icon="📦"
                label="Transaction Batching"
                description="Combine payouts to save on fees"
                onClick={() => {}}
              />
              <SettingsRow
                icon="↩️"
                label="Refund Address"
                description="Bitcoin address for trade cancellations"
                onClick={() => {}}
              />
              <SettingsRow
                icon="📤"
                label="Custom Payout Wallet"
                description="Send your sats to an external wallet automatically"
                onClick={() => {}}
                noBorder
              />
            </SettingsSection>

            {/* ── APP & NOTIFICATIONS ── */}
            <SettingsSection title="App & Notifications">
              <SettingsRow
                icon="🔔"
                label="Notifications"
                description="Trade updates, matches, and alerts"
                onClick={() => {}}
              />
              <SettingsRow
                icon="🔑"
                label="Pin Code"
                description="Protect the app with a PIN"
                onClick={() => {}}
              />
              <SettingsRow
                icon="💱"
                label="Currency"
                description="EUR"
                onClick={() => {}}
              />
              <SettingsRow
                icon="🌐"
                label="Language"
                description="English"
                onClick={() => {}}
              />
              <SettingsRow
                icon="🌙"
                label="Dark Mode"
                right={<Toggle checked={darkMode} onChange={setDarkMode}/>}
              />
              <SettingsRow
                icon="🔧"
                label="Diagnostics"
                description="Share anonymous usage data to help improve the app"
                right={<Toggle checked={diagnostics} onChange={setDiagnostics}/>}
                noBorder
              />
            </SettingsSection>

            {/* ── ADVANCED & SUPPORT ── */}
            <SettingsSection title="Advanced & Support">
              <SettingsRow
                icon="🖧"
                label="Use Your Own Node"
                description="Connect to a custom Bitcoin node"
                onClick={() => {}}
              />
              <SettingsRow
                icon="💬"
                label="Contact Peach"
                description="Get help from the Peach team"
                onClick={() => {}}
              />
              <SettingsRow
                icon="ℹ️"
                label="About Peach"
                description="Version, licenses, and legal info"
                onClick={() => {}}
                noBorder
              />
            </SettingsSection>

            <div className="version-footer">
              Peach Bitcoin Web · v0.1.0 · Made with 🍑
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
