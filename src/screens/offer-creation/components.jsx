// ─── OFFER CREATION — SUB-COMPONENTS ────────────────────────────────────────
// Extracted from peach-offer-creation.jsx
// Contains: getSteps, LivePreview, AmountSlider (merged Buy+Sell), PMModal
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { SatsAmount } from "../../components/BitcoinAmount.jsx";
import { SAT, fmt, satsToFiatRaw as satsToFiat, fmtFiat as fmtEur } from "../../utils/format.js";

// ─── CONSTANTS (shared with index.jsx) ──────────────────────────────────────

// Which currencies each method type supports
export const METHOD_CURRENCIES = {
  SEPA:    ["EUR","CHF"],
  Revolut: ["EUR","CHF","GBP","USD","SEK","NOK"],
  Wise:    ["EUR","CHF","GBP","USD","SEK","NOK"],
  PayPal:  ["EUR","GBP","USD"],
  Strike:  ["USD"],
  Cash:    ["EUR","CHF","GBP","USD"],
};

// Fields to collect per method type
export const METHOD_FIELDS = {
  SEPA:    [{key:"holder",  label:"Account holder name", placeholder:"Full name"},
            {key:"iban",    label:"IBAN",                placeholder:"DE89 3704 0044 0532 0130 00"}],
  Revolut: [{key:"username",label:"Revolut username",    placeholder:"@username"}],
  Wise:    [{key:"email",   label:"Email or @handle",    placeholder:"you@example.com"}],
  PayPal:  [{key:"email",   label:"PayPal email",        placeholder:"you@example.com"}],
  Strike:  [{key:"username",label:"Strike username",     placeholder:"@username"}],
  Cash:    [{key:"description",label:"Meeting details",  placeholder:"e.g. in-person, Berlin area"}],
};

export const CHF_EUR    = 0.96;           // mock CHF/EUR rate
export const LIMIT_EUR  = 1000 * CHF_EUR; // ≈ 960 EUR — daily trading limit
export const MIN_SATS   = 20_000;
export const maxSatsAtPrice = (price) => Math.floor((LIMIT_EUR / price) * SAT);

// Derive a short display label for a saved PM
export function methodLabel(pm) {
  const d = pm.details || {};
  const curr = (pm.currencies||[]).join("/");
  const t = (pm.type||"").split("-")[0].toLowerCase();
  if(t==="sepa")    return `SEPA · ${curr} · ${d.iban?d.iban.replace(/\s/g,"").slice(0,6)+"…":(d.beneficiary||d.holder||"—")}`;
  if(t==="revolut") return `Revolut · ${curr} · ${d.username||d.userName||"—"}`;
  if(t==="wise")    return `Wise · ${curr} · ${d.email||d.userName||"—"}`;
  if(t==="paypal")  return `PayPal · ${curr} · ${d.email||"—"}`;
  if(t==="strike")  return `Strike · ${curr} · ${d.username||d.userName||"—"}`;
  if(t==="cash")    return `Cash · ${curr}`;
  return pm.type;
}


// ─── HELPERS ────────────────────────────────────────────────────────────────

// Steps: 0 = Configure, 1 = Review, 2 = Escrow (sell only)
export function getSteps(type) {
  return type === "sell" ? ["Configure","Review","Escrow"] : ["Configure","Review"];
}


// ─── LIVE PREVIEW ───────────────────────────────────────────────────────────

export function LivePreview({ type, form, btcPrice, offerMethods, offerCurrencies }) {
  const isBuy = type==="buy";
  const prem  = parseFloat(form.premium)||0;
  const effP  = btcPrice*(1+prem/100);
  const hasAmt  = isBuy?form.amtFixed>0:form.amtFixed>0;
  const hasPay  = offerMethods.length>0;
  const hasPrem = form.premium!=="";
  const empty   = !hasAmt&&!hasPay&&!hasPrem;

  let fiatStr="—";
  if(hasAmt){
    fiatStr=`≈ €${fmtEur(satsToFiat(form.amtFixed,effP))}`;
  }
  let premCls="pt-n";
  const p=parseFloat(form.premium)||0;
  if(p!==0) premCls=isBuy?(p<0?"pt-g":"pt-r"):(p>0?"pt-g":"pt-r");

  return (
    <div>
      <div className="preview-label">Market preview</div>
      {empty?(
        <div className="placeholder">
          <div style={{fontSize:"1.8rem",opacity:.3}}>🍑</div>
          <div style={{fontSize:".72rem",fontWeight:600}}>Fill in the form to preview<br/>your offer</div>
        </div>
      ):(
        <div className={`prev-card ${isBuy?"buy-top":"sell-top"}`}>

          {/* Row 1: Your offer badge left · Buy/Sell button right */}
          <div className="prev-top">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="prev-avatar">PW<div className="prev-dot"/></div>
              <div>
                <div style={{fontSize:".76rem",fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                  <span style={{color:"#F7931A"}}>★</span>4.7
                  <span style={{fontSize:".65rem",color:"var(--black-65)",fontWeight:500,marginLeft:2}}>(23)</span>
                </div>
                <div style={{fontSize:".58rem",fontWeight:800,color:"var(--primary-dark)",
                  background:"var(--primary-mild)",borderRadius:999,padding:"1px 6px",
                  marginTop:2,display:"inline-block"}}>Your offer</div>
              </div>
            </div>
            <button style={{padding:"5px 16px",borderRadius:999,border:"none",
              fontFamily:"var(--font)",fontSize:".76rem",fontWeight:800,cursor:"default",
              background:isBuy?"var(--error-bg)":"var(--success-bg)",
              color:isBuy?"var(--error)":"var(--success)"}}>
              {isBuy?"Sell":"Buy"}
            </button>
          </div>

          {/* Row 2: left spacer · right = stacked amounts */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
            padding:"4px 0 8px"}}>
            <div style={{flex:1}}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
              {hasAmt
                ? <SatsAmount sats={form.amtFixed}/>
                : <span style={{color:"var(--black-25)",fontSize:".9rem",fontWeight:700}}>—</span>
              }
              {hasAmt&&(
                <span style={{fontSize:".78rem",fontWeight:600,color:"var(--black-65)"}}>{fiatStr}</span>
              )}
              {hasPrem&&p!==0&&(
                <span style={{fontSize:".72rem",fontWeight:700,
                  color:isBuy?(p<0?"var(--success)":"var(--error)"):(p>0?"var(--success)":"var(--error)")}}>
                  {p>0?"+":""}{p.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Row 3: tags */}
          <div style={{display:"flex",flexWrap:"wrap",gap:3,paddingBottom:4}}>
            {hasPrem&&<span className={`pt ${premCls}`}>{p===0?"0%":(p>0?"+":"")+p.toFixed(2)+"%"}</span>}
            {offerMethods.slice(0,3).map(m=><span key={m} className="pt pt-m">{m}</span>)}
            {offerCurrencies.slice(0,3).map(c=><span key={c} className="pt pt-c">{c}</span>)}
            {form.instantMatch&&<span style={{
              padding:"2px 7px",borderRadius:999,fontSize:".6rem",fontWeight:800,
              background:"var(--grad)",color:"white",border:"none"}}>⚡ Instant Match</span>}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── AMOUNT SLIDER (unified buy + sell) ─────────────────────────────────────

export function AmountSlider({ form, setF, btcPrice }) {
  const maxSats = maxSatsAtPrice(btcPrice);
  const val = form.amtFixed || MIN_SATS;
  const pct = ((val - MIN_SATS) / (maxSats - MIN_SATS)) * 100;

  const snap = (v) => Math.round(v / 1000) * 1000;
  const currentFiat = satsToFiat(val, btcPrice);
  const pctOfLimit  = currentFiat / LIMIT_EUR;
  const nearLimit   = pctOfLimit >= 0.9;

  const pctRiseToLimit = nearLimit
    ? ((LIMIT_EUR / currentFiat) - 1) * 100
    : null;

  const barColor = pctOfLimit < 0.9 ? "var(--success)" : "#E6A000";

  return (
    <>
      {/* Display */}
      <div className="amt-display">
        <SatsAmount sats={val}/>
        <span className="amt-display-fiat">≈ €{fmtEur(currentFiat)}</span>
      </div>

      {/* Slider */}
      <div className="amt-slider-wrap">
        <div className="amt-slider-track"/>
        <div className="amt-slider-fill" style={{left:0,right:`${100-pct}%`}}/>
        <input type="range" className="amt-slider"
          min={MIN_SATS} max={maxSats} step={1000}
          value={val}
          onChange={e=>setF("amtFixed",snap(+e.target.value))}/>
      </div>

      {/* Labels */}
      <div className="amt-labels">
        <span>{fmt(MIN_SATS)} sats</span>
        <span style={{color:"var(--black-25)"}}>≤ 1 000 CHF limit</span>
        <span>{fmt(maxSats)} sats</span>
      </div>

      {/* Limit bar */}
      <div className="limit-bar-wrap">
        <div className="limit-bar-label">
          <span>Daily limit usage</span>
          <span style={{color:pctOfLimit>=0.9?"#7A5F00":"var(--black-65)"}}>
            €{Math.round(currentFiat).toLocaleString()} / €{Math.round(LIMIT_EUR).toLocaleString()}
          </span>
        </div>
        <div className="limit-bar-track">
          <div className="limit-bar-fill" style={{
            width:`${Math.min(pctOfLimit*100,100)}%`,
            background:barColor
          }}/>
        </div>
      </div>

      {/* Near-limit warning */}
      {nearLimit && (
        <div className="limit-warn">
          <span style={{fontSize:"1rem",flexShrink:0}}>⚠️</span>
          <span>
            Careful — this offer will be withdrawn from the market if the Bitcoin price rises by{" "}
            <strong>{pctRiseToLimit.toFixed(1)}%</strong>.
          </span>
        </div>
      )}
    </>
  );
}


// ─── PM MODAL (add + edit) ──────────────────────────────────────────────────

export function PMModal({ onSave, onClose, initialData }) {
  const isEdit = !!initialData;

  const [modalStep, setModalStep] = useState(0); // 0=type+currencies, 1=details, 2=summary
  const [selType,   setSelType]   = useState(initialData?.type || "SEPA");
  const [selCurrs,  setSelCurrs]  = useState(initialData?.currencies || ["EUR"]);
  const [details,   setDetails]   = useState(initialData?.details || {});

  function handleTypeChange(t) {
    setSelType(t);
    // Keep only currencies valid for the new type
    const valid = METHOD_CURRENCIES[t] || [];
    setSelCurrs(prev => {
      const kept = prev.filter(c => valid.includes(c));
      return kept.length > 0 ? kept : [valid[0]];
    });
    if(!isEdit) setDetails({});
  }

  function toggleCurr(c) {
    setSelCurrs(prev =>
      prev.includes(c)
        ? prev.length > 1 ? prev.filter(x=>x!==c) : prev  // can't deselect last
        : [...prev, c]
    );
  }

  const fields   = METHOD_FIELDS[selType] || [];
  const step1Ok  = selType && selCurrs.length > 0;
  const [holderError, setHolderError] = useState(null);
  const holderOk = !fields.some(f => f.key === "holder") ||
    (details["holder"]||"").trim().split(/\s+/).filter(Boolean).length >= 2;
  const step2Ok  = fields.every(f => (details[f.key]||"").trim().length > 0) && holderOk;

  function handleSave() {
    const pm = {
      id:         initialData?.id || `pm_${Date.now()}`,
      type:       selType,
      currencies: selCurrs,
      details:    { ...details },
    };
    onSave(pm);
  }

  function handleBackdrop(e) {
    if(e.target === e.currentTarget) onClose();
  }

  // Summary data for step 2
  const summaryRows = [
    ["Type",       selType],
    ["Currencies", selCurrs.join(", ")],
    ...fields.map(f => [f.label, details[f.key]||"—"]),
  ];

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-card">
        <div className="modal-header">
          <span className="modal-title">
            {isEdit ? `Edit ${initialData.type}` :
              modalStep === 0 ? "Add payment method" :
              modalStep === 1 ? `${selType} · details` : "Confirm & save"}
          </span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* 3-dot progress */}
        <div style={{padding:"10px 22px 0"}}>
          <div className="modal-steps">
            {[0,1,2].map(i=>(
              <div key={i} className="modal-step-dot"
                style={{background:modalStep>=i?"var(--primary)":"var(--black-10)"}}/>
            ))}
          </div>
        </div>

        <div className="modal-body">
          {/* ── STEP 0: type + currencies ── */}
          {modalStep===0&&(
            <>
              <div>
                <label className="field-label">Method type</label>
                <div className="select-wrap">
                  <select className="modal-select" value={selType}
                    onChange={e=>handleTypeChange(e.target.value)}>
                    {Object.keys(METHOD_FIELDS).map(t=>(
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label" style={{marginBottom:8}}>
                  Currencies <span style={{fontWeight:500,textTransform:"none",
                    letterSpacing:0,color:"var(--black-25)"}}>— select all that apply</span>
                </label>
                <div className="curr-check-grid">
                  {(METHOD_CURRENCIES[selType]||[]).map(c=>(
                    <button key={c} className={`curr-check-btn${selCurrs.includes(c)?" on":""}`}
                      onClick={()=>toggleCurr(c)}>
                      {selCurrs.includes(c)&&"✓ "}{c}
                    </button>
                  ))}
                </div>
                {selCurrs.length===1&&(
                  <div style={{fontSize:".68rem",color:"var(--black-25)",fontWeight:500,marginTop:6}}>
                    At least one currency required
                  </div>
                )}
              </div>
              <div style={{fontSize:".72rem",color:"var(--black-65)",fontWeight:500,
                lineHeight:1.55,background:"var(--black-5)",borderRadius:8,padding:"8px 10px"}}>
                You'll enter your account details on the next step.
              </div>
            </>
          )}

          {/* ── STEP 1: details ── */}
          {modalStep===1&&(
            <>
              {fields.map(f=>(
                <div key={f.key}>
                  <label className="field-label">{f.label}</label>
                  <input className="field-input" type="text"
                    placeholder={f.placeholder}
                    value={details[f.key]||""}
                    onChange={e=>{setDetails(d=>({...d,[f.key]:e.target.value}));if(f.key==="holder")setHolderError(null);}}
                    onBlur={f.key==="holder"?()=>{
                      const words=(details["holder"]||"").trim().split(/\s+/).filter(Boolean);
                      setHolderError(words.length<2?"Fill out your full name as per your bank details":null);
                    }:undefined}
                    style={f.key==="holder"&&holderError?{borderColor:"#DF321F"}:{}}/>
                  {f.key==="holder"&&holderError&&(
                    <div style={{fontSize:".75rem",color:"#DF321F",marginTop:3,paddingLeft:2}}>{holderError}</div>
                  )}
                </div>
              ))}
              <div style={{fontSize:".72rem",color:"var(--black-65)",fontWeight:500,lineHeight:1.55}}>
                🔒 Your payment details are encrypted and only shared with your matched counterparty.
              </div>
            </>
          )}

          {/* ── STEP 2: summary ── */}
          {modalStep===2&&(
            <>
              <div style={{fontSize:".78rem",color:"var(--black-65)",fontWeight:500,
                lineHeight:1.5,marginBottom:2}}>
                Review your PM before saving.
              </div>
              <div className="modal-summary">
                {summaryRows.map(([k,v])=>(
                  <div key={k} className="modal-summary-row">
                    <span className="msk">{k}</span>
                    <span className="msv">{v}</span>
                  </div>
                ))}
              </div>
              <div style={{fontSize:".72rem",color:"var(--black-65)",fontWeight:500,lineHeight:1.55}}>
                🔒 Your payment details are encrypted and only shared with your matched counterparty.
              </div>
            </>
          )}
        </div>

        <div className="modal-foot">
          {modalStep===0&&(
            <>
              <button className="modal-btn-back" onClick={onClose}>Cancel</button>
              <button className="modal-btn-next" disabled={!step1Ok}
                onClick={()=>setModalStep(1)}>Continue →</button>
            </>
          )}
          {modalStep===1&&(
            <>
              <button className="modal-btn-back" onClick={()=>setModalStep(0)}>← Back</button>
              <button className="modal-btn-next" disabled={!step2Ok}
                onClick={()=>setModalStep(2)}>Review →</button>
            </>
          )}
          {modalStep===2&&(
            <>
              <button className="modal-btn-back" onClick={()=>setModalStep(1)}>← Back</button>
              <button className="modal-btn-next" onClick={handleSave}>
                {isEdit?"Save changes":"Save PM"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
