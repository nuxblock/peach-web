// ─── SETTINGS — SUB-COMPONENTS & HELPERS ─────────────────────────────────────
// Extracted from peach-settings.jsx.
// All components are prop-driven with no parent state closures.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

export const IconCopy = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="11" height="11" rx="2"/><path d="M3 13V3h10"/></svg>;
export const IconTrash = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,7 5,17 15,17 15,7"/><line x1="3" y1="7" x2="17" y2="7"/><line x1="8" y1="3" x2="12" y2="3"/></svg>;
export const IconCamera = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7.5C2 6.4 2.9 5.5 4 5.5h1.5l1.5-2h6l1.5 2H16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8z"/><circle cx="10" cy="11" r="2.5"/></svg>;
export const IconExternalLink = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8"/><polyline points="9,2 12,2 12,5"/><line x1="7" y1="7" x2="12" y2="2"/></svg>;
export const IconShield = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L3 5v5c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V5l-7-3z"/></svg>;

export const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
export const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// ── Toggle ───────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width:44, height:26, borderRadius:999, border:"none",
      background: checked ? "var(--primary)" : "var(--black-25)",
      cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0, padding:0,
    }}>
      <span style={{
        position:"absolute", top:3, left: checked ? 21 : 3,
        width:20, height:20, borderRadius:"50%", background:"var(--surface)",
        boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s", display:"block",
      }}/>
    </button>
  );
}

// ── SettingsRow ──────────────────────────────────────────────────────────────

export function SettingsRow({ label, description, icon, right, warning, onClick, noBorder }) {
  return (
    <div onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:14, padding:"14px 20px",
      borderBottom: noBorder ? "none" : "1px solid var(--black-5)",
      cursor: onClick ? "pointer" : "default", transition:"background .12s",
      borderRadius: noBorder ? "0 0 12px 12px" : 0,
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.background="var(--bg)"; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
      {icon && (
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--black-5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"1rem" }}>
          {icon}
        </div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:".9rem", fontWeight:600, color: warning ? "var(--error)" : "var(--black)", lineHeight:1.3 }}>{label}</div>
        {description && <div style={{ fontSize:".75rem", color:"var(--black-65)", marginTop:2, fontWeight:400 }}>{description}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        {right}
        {warning && <span style={{ fontSize:"1.1rem" }}>⚠️</span>}
        {onClick && <span style={{ color:"var(--black-25)" }}><IconChevronRight/></span>}
      </div>
    </div>
  );
}

// ── SettingsSection ──────────────────────────────────────────────────────────

export function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"var(--primary)", marginBottom:8, paddingLeft:4 }}>
        {title}
      </div>
      <div style={{ background:"var(--surface)", border:"1px solid var(--black-10)", borderRadius:12, overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ── SubScreenWrapper ─────────────────────────────────────────────────────────

export function SubScreenWrapper({ title, onBack, children }) {
  return (
    <div className="settings-scroll">
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          width:34, height:34, borderRadius:8, border:"none",
          background:"transparent", cursor:"pointer", color:"var(--black-65)", flexShrink:0,
        }}
        onMouseEnter={e => e.currentTarget.style.background="var(--black-5)"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <IconChevronLeft/>
        </button>
        <h1 style={{ fontSize:"1.3rem", fontWeight:800, color:"var(--black)", letterSpacing:"-0.02em", margin:0 }}>{title}</h1>
      </div>
      {children}
    </div>
  );
}

// ── CopyBtn ──────────────────────────────────────────────────────────────────

export function CopyBtn({ text, size=16 }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} title="Copy" style={{ border:"none", background:"transparent", cursor:"pointer", color: copied ? "var(--success)" : "var(--primary)", padding:4, borderRadius:6, display:"flex", alignItems:"center" }}>
      {copied ? <span style={{ fontSize:".7rem", fontWeight:700 }}>✓</span> : <IconCopy size={size}/>}
    </button>
  );
}

// ── PrimaryBtn ───────────────────────────────────────────────────────────────

export function PrimaryBtn({ label, onClick, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width:"100%", padding:"13px 20px", borderRadius:999, border:"none",
      background: disabled ? "var(--black-25)" : "var(--grad)",
      color:"var(--surface)", fontFamily:"'Baloo 2',cursive", fontSize:".85rem",
      fontWeight:800, letterSpacing:".06em", textTransform:"uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      {label}
    </button>
  );
}

// ── OutlineBtn ───────────────────────────────────────────────────────────────

export function OutlineBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", padding:"12px 20px", borderRadius:999,
      border:"2px solid var(--primary)", background:"transparent",
      color:"var(--primary)", fontFamily:"'Baloo 2',cursive", fontSize:".85rem",
      fontWeight:800, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer",
    }}>
      {label}
    </button>
  );
}

// ── FieldError ───────────────────────────────────────────────────────────────

export function FieldError({ error }) {
  if (!error) return null;
  return (
    <div style={{ fontSize:".72rem", fontWeight:600, color:"var(--error)", marginTop:4, marginBottom:4, paddingLeft:2 }}>
      {error}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function makeBlurHandler(setErrors) {
  return (fieldKey, value, validatorFn, ...extraArgs) => {
    const result = validatorFn(value, ...extraArgs);
    setErrors(prev => ({ ...prev, [fieldKey]: result.valid ? null : result.error }));
    return result.valid;
  };
}

