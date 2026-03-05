// ─── BITCOIN ICON ─────────────────────────────────────────────────────────────
export const IcoBtc = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display:"inline-block", verticalAlign:"middle", flexShrink:0 }}>
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path d="M22.2 13.8c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.3l-2.1-.5-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8.9l-.8 3.3c.1 0 .2 0 .3.1-.1 0-.2-.1-.3-.1L11.4 20c-.1.3-.4.7-1 .5 0 0-1.2-.3-1.2-.3l-.8 1.8 2 .5c.4.1.7.2 1.1.3l-.7 2.7 1.6.4.7-2.7c.4.1.9.2 1.4.3l-.7 2.7 1.6.4.7-2.7c2.8.5 4.9.3 5.8-2.2.7-2-.03-3.2-1.5-3.9 1.1-.25 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2-3.9.9-5 .6l.9-3.5c1.1.3 4.6.8 4.1 2.9zm.5-5.3c-.45 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.8.6 3.4 2.5z" fill="white"/>
  </svg>
);

// ─── SIZE PRESETS ──────────────────────────────────────────────────────────────
const SIZE_MAP = {
  sm: { fs: ".82rem",  ico: 13 },
  md: { fs: ".95rem",  ico: 15 },
  lg: { fs: "1.2rem",  ico: 18 },
};

// ─── BITCOIN AMOUNT ────────────────────────────────────────────────────────────
// Props:
//   sats      — integer satoshi amount (required)
//   size      — "sm" | "md" | "lg"  (default "md")
//   fontSize  — overrides size preset font size (e.g. "1.6rem")
//
// The grey leading-zeros and black sats label are always wrapped together
// in a single nowrap span so they can never split across lines.
export function SatsAmount({ sats, size = "md", fontSize }) {
  const preset = SIZE_MAP[size] ?? SIZE_MAP.md;
  const fs  = fontSize ?? preset.fs;
  const ico = preset.ico;

  const satsStr = sats.toLocaleString("fr-FR");

  // ≥ 1 BTC
  if (sats >= 100_000_000) {
    const btc = (sats / 100_000_000).toFixed(2).replace(".", ",");
    return (
      <span style={{ display:"inline-flex", alignItems:"center", gap:5, flexWrap:"nowrap", whiteSpace:"nowrap" }}>
        <IcoBtc size={ico}/>
        <span style={{ color:"var(--black)", fontWeight:800, fontSize:fs, whiteSpace:"nowrap" }}>{btc} BTC</span>
      </span>
    );
  }

  // < 1 BTC — grey leading zeros + black sats, glued together
  const digits       = sats.toString().length;
  const leadingZeros = 8 - digits;
  const greyPart     = "0," + "0".repeat(leadingZeros);

  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, flexWrap:"nowrap", whiteSpace:"nowrap" }}>
      <IcoBtc size={ico}/>
      {/* Single nowrap wrapper keeps grey + black on the same line always */}
      <span style={{ whiteSpace:"nowrap" }}>
        <span style={{ color:"#C4B5AE", fontWeight:700, fontSize:fs }}>{greyPart}</span><span style={{ color:"var(--black)", fontWeight:800, fontSize:fs }}>{satsStr} Sats</span>
      </span>
    </span>
  );
}
