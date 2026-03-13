// ─── SHARED STATUS CHIP COMPONENT ────────────────────────────────────────────
// Coloured pill that displays a trade status label.
// Props:
//   status     — TradeStatus string (key into STATUS_CONFIG)
//   large      — bigger padding/font (used in trade-execution topbar)
//   showAction — show a small dot when the status requires action (used in dashboard)
// Used by: trade-execution, trades-dashboard
// ─────────────────────────────────────────────────────────────────────────────
import { STATUS_CONFIG } from "../data/statusConfig.js";

const FALLBACK = { label: "Unknown", bg: "#F4EEEB", color: "#7D675E", action: false };

export default function StatusChip({ status, large, showAction }) {
  const cfg = STATUS_CONFIG[status] || FALLBACK;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:cfg.bg, color:cfg.color,
      borderRadius:999, padding: large ? "5px 14px" : "2px 10px",
      fontSize: large ? ".8rem" : ".72rem", fontWeight:700, whiteSpace:"nowrap",
    }}>
      {showAction && cfg.action && <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.color, display:"inline-block" }}/>}
      {cfg.label}
    </span>
  );
}
