/**
 * RepeatTraderBadge — shows next to other user badges (supertrader, fast, …)
 * when the current user has traded with this user before.
 *
 * Mirrors the mobile app's badge:
 *   - badExperience=false → primary-color outlined pill with the trade count
 *   - badExperience=true  → error-color outlined pill with a thumbs-down icon
 * Renders nothing when not logged in, looking at self, no prior trades, or on error.
 */
import { useUserStatus } from "../hooks/useUserStatus.js";

export default function RepeatTraderBadge({ userId }) {
  const status = useUserStatus(userId);
  if (!status || !status.trades) return null;

  const bad = status.badExperience;
  const color = bad ? "var(--error)" : "var(--primary)";
  const title = bad
    ? "Bad past experience with this user"
    : `Repeat trader — you've traded with this user ${status.trades} time${status.trades === 1 ? "" : "s"} before`;

  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        border: `1.5px solid ${color}`,
        borderRadius: 999,
        padding: "1px 8px",
        fontSize: ".65rem",
        fontWeight: 700,
        color,
        background: "transparent",
        whiteSpace: "nowrap",
      }}
    >
      {bad ? "👎" : `🔁 ${status.trades}`}
    </span>
  );
}
