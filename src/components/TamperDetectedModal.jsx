const css = `
.td-overlay{
  position:fixed;inset:0;z-index:700;
  background:rgba(43,25,17,.55);
  display:flex;align-items:center;justify-content:center;
  padding:20px;animation:fadeIn .15s ease;
}
.td-card{
  background:var(--surface);border-radius:20px;padding:36px 32px;
  max-width:420px;width:100%;text-align:center;
  box-shadow:0 20px 60px rgba(0,0,0,.25);
  animation:authPopIn .2s cubic-bezier(.34,1.56,.64,1);
}
.td-icon{
  width:64px;height:64px;border-radius:50%;
  background:var(--error-bg);display:flex;align-items:center;justify-content:center;
  margin:0 auto 18px;
}
.td-title{font-weight:800;font-size:1.15rem;color:var(--black);margin-bottom:8px}
.td-desc{font-size:.85rem;color:var(--black-65);line-height:1.6;margin-bottom:24px}
.td-fields{font-weight:700;color:var(--black)}
.td-btn{
  padding:11px 32px;border-radius:999px;background:var(--grad);color:white;
  font-family:var(--font);font-size:.88rem;font-weight:800;border:none;cursor:pointer;
  transition:transform .1s;
}
.td-btn:hover{transform:translateY(-1px)}
`;

export default function TamperDetectedModal({ fields, onClose }) {
  const list = Array.from(fields || []);
  const fieldsText = list.length === 0
    ? "your encrypted data"
    : list.length === 1
      ? list[0]
      : list.slice(0, -1).join(", ") + " and " + list[list.length - 1];

  return (
    <>
      <style>{css}</style>
      <div className="td-overlay">
        <div className="td-card">
          <div className="td-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="td-title">Data integrity check failed</div>
          <div className="td-desc">
            The signature on your <span className="td-fields">{fieldsText}</span> did not verify against your own PGP key.
            This may indicate the server returned data that was modified after you saved it.
            <br/><br/>
            Please contact Peach support before trading or saving over this data.
          </div>
          <button className="td-btn" onClick={onClose}>I understand</button>
        </div>
      </div>
    </>
  );
}
