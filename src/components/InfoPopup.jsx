// ─── INFO POPUP ─────────────────────────────────────────────────────────────
// Shared in-context help modal + inline "?" dot trigger. Mirrors the mobile
// app's help popups but styled to the Peach web modal pattern (white card,
// pill button, top-right close). Blue is used as an accent for "info".
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";

const INFO_BLUE = "#1FA3E8";

const INFO_CSS = `
  .ip-overlay{position:fixed;inset:0;z-index:700;background:rgba(43,25,17,.55);
    display:flex;align-items:center;justify-content:center;padding:20px;
    animation:ip-fade .15s ease}
  @keyframes ip-fade{from{opacity:0}to{opacity:1}}
  .ip-card{position:relative;background:var(--surface);border-radius:16px;
    padding:28px 24px;max-width:380px;width:100%;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
    animation:modalIn .18s ease;color:var(--text);font-family:var(--font)}
  .ip-header{display:flex;align-items:flex-start;gap:12px}
  .ip-icon{flex-shrink:0;color:${INFO_BLUE};font-weight:800;font-size:1.35rem;
    line-height:1.2;margin-top:1px}
  .ip-title{font-weight:800;font-size:1.05rem;margin:0;color:var(--text);
    line-height:1.25;flex:1;min-width:0}
  .ip-body{margin-top:14px;padding-left:30px}
  .ip-text{font-size:.88rem;line-height:1.6;color:var(--black-65);margin:0}
  .ip-text + .ip-text{margin-top:10px}
  .ip-actions{margin-top:22px;display:flex}
  .ip-btn{flex:1;border:none;border-radius:999px;
    font-family:var(--font);font-weight:800;font-size:.95rem;
    color:#fff;background:${INFO_BLUE};padding:13px;cursor:pointer;
    box-shadow:0 4px 18px rgba(31,163,232,.4);transition:filter .15s}
  .ip-btn:hover{filter:brightness(0.92)}

  .ip-dot{display:inline-flex;align-items:center;justify-content:center;
    width:18px;height:18px;border-radius:50%;border:1.5px solid ${INFO_BLUE};
    background:transparent;color:${INFO_BLUE};cursor:pointer;padding:0;
    margin-left:6px;vertical-align:middle;font-family:var(--font);
    font-weight:800;font-size:.72rem;line-height:1;
    transition:background .12s,color .12s}
  .ip-dot:hover{background:${INFO_BLUE};color:#fff}
  .ip-dot:focus-visible{outline:2px solid ${INFO_BLUE};outline-offset:2px}
`;

export function InfoDot({ onClick, ariaLabel }) {
  return (
    <>
      <style>{INFO_CSS}</style>
      <button
        type="button"
        className="ip-dot"
        aria-label={ariaLabel || "More info"}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
      >
        ?
      </button>
    </>
  );
}

export default function InfoPopup({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <style>{INFO_CSS}</style>
      <div className="ip-overlay" onClick={onClose}>
        <div className="ip-card" onClick={(e) => e.stopPropagation()}>
          <div className="ip-header">
            <span className="ip-icon" aria-hidden="true">ⓘ</span>
            {title && <h2 className="ip-title">{title}</h2>}
          </div>
          <div className="ip-body">{children}</div>
          <div className="ip-actions">
            <button type="button" className="ip-btn" onClick={onClose}>Got it</button>
          </div>
        </div>
      </div>
    </>
  );
}
