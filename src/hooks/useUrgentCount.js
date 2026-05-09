import { useState, useEffect } from "react";
import { getCached } from "./useApi.js";
import { STATUS_CONFIG } from "../data/statusConfig.js";

// Trades that "need your attention" — same predicate the homepage attention
// strip uses, lifted into a hook so the side-nav badge stays in sync.
function _countUrgent(items) {
  if (!Array.isArray(items)) return 0;
  return items.filter(t => {
    const s = t.tradeStatus ?? t.status ?? "unknown";
    return (STATUS_CONFIG[s] || {}).action;
  }).length;
}

function _read() {
  if (!window.__PEACH_AUTH__) return 0;
  const cached = getCached("trades-items")?.data;
  return cached ? _countUrgent(cached) : 0;
}

export function useUrgentCount() {
  const [urgentCount, setUrgentCount] = useState(_read);

  useEffect(() => {
    setUrgentCount(_read());
    const iv = setInterval(() => setUrgentCount(_read()), 3000);
    return () => clearInterval(iv);
  }, []);

  return { urgentCount };
}
