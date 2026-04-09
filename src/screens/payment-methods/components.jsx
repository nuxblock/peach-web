// ─── PAYMENT METHODS — SCREEN-SPECIFIC SUB-COMPONENTS ───────────────────────
// The Add-PM flow and all its helpers/constants now live in the shared
// component at src/components/AddPMFlow.jsx (used by both this screen and
// the Offer Creation screen). Only the PM-list icons and the delete modal
// remain here — they are specific to this screen.
// ─────────────────────────────────────────────────────────────────────────────

// ── Icons ────────────────────────────────────────────────────────────────────

export const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>;
export const IconEdit  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8.5 2.5l3 3M2 9l6-6 3 3-6 6H2V9z"/></svg>;
export const IconTrash = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 4h8M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M4 4l.5 8h5l.5-8"/></svg>;

// ── DeleteModal ──────────────────────────────────────────────────────────────

export function DeleteModal({ pm, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-card" style={{ maxWidth:380 }}>
        <div className="modal-header">
          <span className="modal-title">Delete payment method?</span>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ fontSize:".85rem", color:"var(--black-75)", lineHeight:1.6, marginBottom:6 }}>
            This will permanently remove your <strong>{pm.name}</strong> payment method
            ({pm.currencies.join(", ")}). Any active offers using this method may be affected.
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <button className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button className="btn-delete" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
